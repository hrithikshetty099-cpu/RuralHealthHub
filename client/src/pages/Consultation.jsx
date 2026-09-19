import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiRequest, websocketUrl } from '../lib/api';
import { BackToDashboardButton } from '../components/BackToDashboardButton';
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  Send, 
  Zap, 
  ShieldCheck, 
  Stethoscope
} from 'lucide-react';

export const Consultation = () => {
  const { 
    doctors, 
    activeConsultationDoctor, 
    lowDataMode, 
    networkSpeed, 
    setNetworkSpeed,
    navigateTo,
    authUser,
    activeConsultationAppointment
  } = useApp();

  const [selectedDoctor, setSelectedDoctor] = useState(
    activeConsultationDoctor || doctors.find(d => d.isOnlineNow) || doctors[0]
  );
  
  // Consultation booking & waiting room stage
  const [isInCall, setIsInCall] = useState(false);
  const [patientSymptoms, setPatientSymptoms] = useState('Feeling mild fever, dry cough, and headache since yesterday morning.');
  
  // In-call media controls
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(!lowDataMode);
  
  // Chat state inside call
  const [messages, setMessages] = useState([
    { sender: 'system', text: 'Tele-consultation session connected securely (AES-256 encrypted).' },
    { sender: 'doctor', text: `Namaste Ramesh-ji, I am ${selectedDoctor.name}. Please tell me your symptoms in detail.` }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const [callStatus, setCallStatus] = useState('Waiting for the other participant');
  const [prescription, setPrescription] = useState({ medicines: '', instructions: '', follow_up_date: '' });
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);
  const [consultationId, setConsultationId] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');

  // Auto consultation mode recommendation based on network
  const getConsultationModeRecommendation = () => {
    if (networkSpeed === 'offline') return { mode: 'Offline SMS Queue', badge: 'badge-red', desc: 'No network. Questions will sync via SMS gateway.' };
    if (networkSpeed === 'poor' || lowDataMode) return { mode: 'Audio & Text Mode (Recommended)', badge: 'badge-teal', desc: 'Slow 3G connection detected. Camera is turned off to prevent voice dropping.' };
    if (networkSpeed === 'good') return { mode: 'Low-Bandwidth Video Mode', badge: 'badge-blue', desc: 'Stable 3G/4G detected. Adaptive 360p video enabled.' };
    return { mode: 'HD Video Mode', badge: 'badge-green', desc: 'High-speed broadband network.' };
  };

  const currentMode = getConsultationModeRecommendation();

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    
    const newMsg = { sender: 'patient', text: inputMsg.trim() };
    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');

  };

  const sendSignal = (message) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) socketRef.current.send(JSON.stringify(message));
  };

  const createOffer = async () => {
    const offer = await peerRef.current.createOffer();
    await peerRef.current.setLocalDescription(offer);
    sendSignal({ type: 'offer', offer });
  };

  const handleStartCall = async () => {
    if (lowDataMode || networkSpeed === 'poor') {
      setCameraActive(false);
    }
    try {
      let consultationRoomId = `consultation-${activeConsultationAppointment?.id || selectedDoctor.id}`;
      if (activeConsultationAppointment?.id) {
        const consultationResponse = await apiRequest('/consultations', {
          method: 'POST',
          body: JSON.stringify({ appointment_id: activeConsultationAppointment.id }),
        });
        setConsultationId(consultationResponse.consultation.id);
        consultationRoomId = consultationResponse.consultation.room_id;
      }
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: !lowDataMode && networkSpeed !== 'poor' });
      if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
      const peer = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
      peerRef.current = peer;
      localStreamRef.current.getTracks().forEach((track) => peer.addTrack(track, localStreamRef.current));
      peer.ontrack = (event) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
        setCallStatus('Doctor connected');
      };
      peer.onicecandidate = (event) => {
        if (event.candidate) sendSignal({ type: 'candidate', candidate: event.candidate });
      };
      peer.onconnectionstatechange = () => setCallStatus(peer.connectionState === 'connected' ? 'Live consultation' : peer.connectionState);
      const socket = new WebSocket(websocketUrl());
      socketRef.current = socket;
      socket.onopen = () => sendSignal({ type: 'join', roomId: consultationRoomId });
      socket.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        if (message.type === 'peer-joined') await createOffer();
        if (message.type === 'offer') {
          await peer.setRemoteDescription(message.offer);
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          sendSignal({ type: 'answer', answer });
        }
        if (message.type === 'answer') await peer.setRemoteDescription(message.answer);
        if (message.type === 'candidate') await peer.addIceCandidate(message.candidate);
      };
      setCallStatus('Connected to consultation room; waiting for doctor');
    } catch {
      setCallStatus('Camera or microphone permission is required for a live call');
      return;
    }
    setIsInCall(true);
  };

  const handleEndCall = () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerRef.current?.close();
    socketRef.current?.close();
    setIsInCall(false);
    navigateTo('my-health');
  };

  useEffect(() => () => {
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
    peerRef.current?.close();
    socketRef.current?.close();
  }, []);

  const savePrescription = async (event) => {
    event.preventDefault();
    try {
      if (!consultationId) throw new Error('Join the consultation before completing it.');
      await apiRequest(`/consultations/${consultationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'completed', doctor_notes: doctorNotes, diagnosis, follow_up_instructions: followUpInstructions, follow_up_date: prescription.follow_up_date || null }),
      });
      await apiRequest('/prescriptions', {
        method: 'POST',
        body: JSON.stringify({
          patient_id: activeConsultationAppointment?.patient_id || activeConsultationAppointment?.patientId,
          doctor_id: selectedDoctor.id,
          consultation_id: consultationId,
          medicines: prescription.medicines,
          instructions: prescription.instructions,
          follow_up_date: prescription.follow_up_date || null,
        }),
      });
      setPrescriptionSaved(true);
    } catch (error) {
      setCallStatus(error.message);
    }
  };

  return (
    <div style={{ padding: '2.5rem 0', backgroundColor: 'var(--bg-main)', minHeight: '80vh' }}>
      <div className="container">
        <BackToDashboardButton />
        
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem' }}>
            <Video size={18} /> Rural Tele-Medicine Portal
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.4rem' }}>
            Online Medical Consultation
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            Direct voice & video consultations engineered for unstable 2G/3G connections with instant fallback to audio & chat.
          </p>
        </div>

        {/* Network Adaptation Alert Banner */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1.5px solid #bbf7d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '50%', backgroundColor: '#dcfce7', color: 'var(--accent)' }}>
              <Zap size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>Network Engine: {currentMode.mode}</strong>
                <span className={`badge ${currentMode.badge}`}>{networkSpeed.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {currentMode.desc}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Simulate Network:</span>
            <select
              className="input-control"
              style={{ padding: '0.3rem 0.5rem', fontSize: '0.78rem', width: 'auto' }}
              value={networkSpeed}
              onChange={(e) => setNetworkSpeed(e.target.value)}
            >
              <option value="good">Good 4G (Video)</option>
              <option value="poor">Slow 3G (Audio First)</option>
              <option value="offline">Offline / 2G (Text Queue)</option>
            </select>
          </div>
        </div>

        {!isInCall ? (
          /* Waiting Room / Pre-Call Setup */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem'
          }}>
            {/* Left: Doctor Selection & Patient Note */}
            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={18} color="var(--primary)" /> 1. Select Available Doctor
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                {doctors.filter(d => d.isOnlineNow || d.consultationType !== 'In-Person').map(doc => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: `2px solid ${selectedDoctor.id === doc.id ? 'var(--primary)' : 'var(--border-color)'}`,
                      backgroundColor: selectedDoctor.id === doc.id ? '#f0fdfa' : '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}
                  >
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--primary-light)',
                      color: 'var(--primary-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700
                    }}>
                      {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{doc.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{doc.specialization} • {doc.hospitalName}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-dark)' }}>₹{doc.consultationFee}</div>
                      <span className="badge badge-green" style={{ fontSize: '0.7rem' }}>Available</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Describe Symptoms / Health Problem for the Doctor:
                </label>
                <textarea
                  className="input-control"
                  rows="3"
                  value={patientSymptoms}
                  onChange={(e) => setPatientSymptoms(e.target.value)}
                  placeholder="e.g. Fever duration, body pain, dizziness..."
                />
              </div>

              <button
                onClick={handleStartCall}
                className="btn btn-success btn-lg"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Video size={18} /> Join Tele-Consultation Room
              </button>
            </div>

            {/* Right: Technical Readiness & Instructions */}
            <div className="card" style={{ backgroundColor: '#ffffff' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="var(--primary)" /> Consultation Waiting Room
              </h3>

              <div style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem auto',
                  color: 'var(--primary)'
                }}>
                  <Stethoscope size={30} />
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                  Consulting with {selectedDoctor.name}
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
                  {selectedDoctor.specialization} ({selectedDoctor.qualification})
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#dcfce7',
                  color: 'var(--accent)',
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}>
                  ● Doctor is Active in Online Clinic
                </div>
              </div>

              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                3G Low Data Features Active:
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <li>✓ Automatic bitrate compression matching current network</li>
                <li>✓ Background audio stream prioritization</li>
                <li>✓ Zero app install required; operates inside mobile browser</li>
                <li>✓ Instant SMS transmission of prescribed medicines</li>
              </ul>
            </div>
          </div>
        ) : (
          /* Live Consultation Room UI */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {/* Left: Video / Audio Stream area */}
            <div className="card" style={{
              backgroundColor: '#0f172a',
              color: '#ffffff',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '440px'
            }}>
              {/* Call Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedDoctor.name}</div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{selectedDoctor.specialization} • {selectedDoctor.hospitalName}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="badge badge-green">● LIVE (03:42)</span>
                  <span className="badge badge-teal" style={{ fontSize: '0.72rem' }}>
                    {lowDataMode ? 'Audio Optimized' : 'Adaptive Video'}
                  </span>
                </div>
              </div>

              {/* Main Video Viewport or Audio Waveform */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '1.5rem 0',
                position: 'relative'
              }}>
                {cameraActive && !lowDataMode ? (
                  <div style={{ width: '100%', height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
                    <video ref={remoteVideoRef} autoPlay playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#1e293b' }} />
                    <video ref={localVideoRef} autoPlay muted playsInline style={{ width: '120px', height: '84px', objectFit: 'cover', position: 'absolute', right: '10px', bottom: '10px', borderRadius: '6px', border: '1px solid #ffffff' }} />
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(0,0,0,0.6)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}>
                      {callStatus}
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(13, 148, 136, 0.2)',
                      border: '2px solid var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem auto'
                    }}>
                      <Mic size={40} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Audio Consultation Active</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', maxWidth: '320px', margin: '0 auto' }}>
                      Low network detected. Camera disabled to save 90% mobile bandwidth while maintaining clear doctor voice.
                    </p>
                  </div>
                )}
              </div>

              {/* Call Controls Bar */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-full)'
              }}>
                <button
                  onClick={() => setMicActive(!micActive)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: micActive ? '#334155' : '#dc2626',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={micActive ? 'Mute Mic' : 'Unmute Mic'}
                >
                  {micActive ? <Mic size={18} /> : <MicOff size={18} />}
                </button>

                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: cameraActive ? '#334155' : '#dc2626',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={cameraActive ? 'Turn Off Video' : 'Turn On Video'}
                >
                  {cameraActive ? <Video size={18} /> : <VideoOff size={18} />}
                </button>

                <button
                  onClick={handleEndCall}
                  style={{
                    padding: '0 1.25rem',
                    height: '44px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: '#dc2626',
                    color: '#ffffff',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem'
                  }}
                >
                  <PhoneOff size={18} /> End Call
                </button>
              </div>
            </div>

            {/* Right: Live Chat & Prescription Notes */}
            <div className="card" style={{
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              height: '440px'
            }}>
              <div style={{
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '0.75rem',
                marginBottom: '0.75rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, fontSize: '0.95rem' }}>
                  <MessageSquare size={16} color="var(--primary)" /> Consultation Chat & Symptoms
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Auto Saved</span>
              </div>

              {/* Chat Message Stream */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.6rem',
                paddingRight: '0.4rem',
                fontSize: '0.85rem'
              }}>
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    style={{
                      alignSelf: m.sender === 'patient' ? 'flex-end' : m.sender === 'system' ? 'center' : 'flex-start',
                      backgroundColor: m.sender === 'patient' ? 'var(--primary-light)' : m.sender === 'system' ? '#f1f5f9' : '#f8fafc',
                      color: m.sender === 'patient' ? 'var(--primary-dark)' : m.sender === 'system' ? '#64748b' : 'var(--text-main)',
                      border: '1px solid var(--border-color)',
                      padding: '0.5rem 0.8rem',
                      borderRadius: 'var(--radius-md)',
                      maxWidth: '85%',
                      fontSize: m.sender === 'system' ? '0.78rem' : '0.85rem'
                    }}
                  >
                    {m.sender === 'doctor' && <strong style={{ display: 'block', color: 'var(--primary-dark)', fontSize: '0.75rem' }}>{selectedDoctor.name}</strong>}
                    {m.text}
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Type message or question for doctor..."
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  <Send size={15} />
                </button>
              </form>
            </div>

            {authUser?.role === 'doctor' && (
              <form className="card" onSubmit={savePrescription} style={{ backgroundColor: '#ffffff' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Complete consultation</h3>
                <label style={{ display: 'grid', gap: '0.4rem', marginBottom: '0.8rem', fontWeight: 600 }}>
                  Diagnosis / clinical notes
                  <textarea required rows="3" className="input-control" value={diagnosis} onChange={(event) => setDiagnosis(event.target.value)} />
                </label>
                <label style={{ display: 'grid', gap: '0.4rem', marginBottom: '0.8rem', fontWeight: 600 }}>
                  Consultation notes
                  <textarea required rows="3" className="input-control" value={doctorNotes} onChange={(event) => setDoctorNotes(event.target.value)} />
                </label>
                <label style={{ display: 'grid', gap: '0.4rem', marginBottom: '0.8rem', fontWeight: 600 }}>
                  Follow-up instructions
                  <textarea rows="2" className="input-control" value={followUpInstructions} onChange={(event) => setFollowUpInstructions(event.target.value)} />
                </label>
                <label style={{ display: 'grid', gap: '0.4rem', marginBottom: '0.8rem', fontWeight: 600 }}>
                  Prescription / medicines
                  <textarea required rows="3" className="input-control" value={prescription.medicines} onChange={(event) => setPrescription({ ...prescription, medicines: event.target.value })} placeholder="Enter only medicines you prescribed" />
                </label>
                <label style={{ display: 'grid', gap: '0.4rem', marginBottom: '0.8rem', fontWeight: 600 }}>
                  Instructions
                  <textarea rows="3" className="input-control" value={prescription.instructions} onChange={(event) => setPrescription({ ...prescription, instructions: event.target.value })} />
                </label>
                <label style={{ display: 'grid', gap: '0.4rem', marginBottom: '1rem', fontWeight: 600 }}>
                  Follow-up date
                  <input type="date" className="input-control" value={prescription.follow_up_date} onChange={(event) => setPrescription({ ...prescription, follow_up_date: event.target.value })} />
                </label>
                <button className="btn btn-primary" type="submit">{prescriptionSaved ? 'Prescription Saved' : 'Send Prescription to Patient'}</button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
