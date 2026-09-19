import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { apiRequest } from '../lib/api';
import { MapPin, PackageCheck, Truck, ArrowRight, Pill } from 'lucide-react';
import { BackToDashboardButton } from '../components/BackToDashboardButton';

export const MedicineDelivery = () => {
  const { navigateTo, prescriptions, deliveries } = useApp();
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [village, setVillage] = useState('');
  const [district, setDistrict] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(prescriptions[0] || null);
  const [activeDelivery, setActiveDelivery] = useState(deliveries[0] || null);
  const [message, setMessage] = useState('');

  const handleRequestDelivery = async () => {
    if (!selectedPrescription || !deliveryLocation.trim()) return;
    try {
      const response = await apiRequest('/medicine-deliveries', {
        method: 'POST',
        body: JSON.stringify({ prescription_id: selectedPrescription.id, delivery_address: deliveryLocation, village, district, phone }),
      });
      setActiveDelivery(response.delivery);
      setMessage('Delivery request created. The pharmacy will update its status here.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem 3.5rem', minHeight: '70vh' }}>
      <BackToDashboardButton />
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ margin: 0, color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '0.75rem' }}>
          Medicine Delivery
        </p>
        <h1 style={{ margin: '0.35rem 0 0', fontSize: '2rem', fontWeight: 800 }}>Prescription & delivery flow</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem' }}>
            <Pill size={18} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Prescription</h3>
          </div>

          {prescriptions.length > 0 ? (
            <>
              <select className="input-control" value={selectedPrescription?.id || ''} onChange={(event) => setSelectedPrescription(prescriptions.find((item) => String(item.id) === event.target.value))}>
                {prescriptions.map((item) => <option key={item.id} value={item.id}>{item.doctor_name} - {new Date(item.created_at).toLocaleDateString()}</option>)}
              </select>
              <div style={{ display: 'grid', gap: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <div><strong style={{ color: 'var(--text-main)' }}>Doctor:</strong> {selectedPrescription?.doctor_name}</div>
                <div><strong style={{ color: 'var(--text-main)' }}>Medicines:</strong> {selectedPrescription?.medicines}</div>
                <div><strong style={{ color: 'var(--text-main)' }}>Instructions:</strong> {selectedPrescription?.instructions || 'Follow the doctor\'s instructions.'}</div>
              </div>
            </>
          ) : <p style={{ color: 'var(--text-muted)' }}>No doctor prescription is available yet. Medicines can only be requested after an authorized doctor sends a prescription.</p>}

          <button disabled={!selectedPrescription} onClick={handleRequestDelivery} className="btn btn-primary" style={{ marginTop: '1.25rem', justifyContent: 'center', width: '100%' }}>
            Request Medicine Delivery
          </button>
        </div>

        <div className="card" style={{ backgroundColor: '#ffffff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem' }}>
            <MapPin size={18} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Village delivery location</h3>
          </div>

          <textarea
            value={deliveryLocation}
            onChange={(e) => setDeliveryLocation(e.target.value)}
            rows={4}
            style={{ width: '100%', resize: 'vertical', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.8rem', fontFamily: 'inherit' }}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
            <input className="input-control" value={village} onChange={(event) => setVillage(event.target.value)} placeholder="Village" required />
            <input className="input-control" value={district} onChange={(event) => setDistrict(event.target.value)} placeholder="District" required />
          </div>
          <input className="input-control" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Delivery phone" style={{ marginTop: '0.75rem' }} required />

          <div style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--text-main)' }}>Courier ETA:</strong> 30-45 minutes
          </div>
        </div>
      </div>

      <div className="card" style={{ backgroundColor: '#ffffff', marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem' }}>
          <Truck size={18} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Delivery tracking</h3>
        </div>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {['requested', 'preparing', 'dispatched', 'out_for_delivery', 'delivered'].map((stage) => {
            const active = Boolean(activeDelivery && ['requested', 'preparing', 'dispatched', 'out_for_delivery', 'delivered'].indexOf(stage) <= ['requested', 'preparing', 'dispatched', 'out_for_delivery', 'delivered'].indexOf(activeDelivery.status));
            return (
              <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: active ? '#10b981' : '#e2e8f0',
                    border: active ? 'none' : '1px solid var(--border-color)',
                  }}
                />
                <span style={{ color: active ? 'var(--text-main)' : 'var(--text-muted)', fontWeight: active ? 700 : 500 }}>
                  {stage.replaceAll('_', ' ')}
                </span>
              </div>
            );
          })}
        </div>

        {message && <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>{message}</p>}

        <button onClick={() => navigateTo('my-health')} className="btn btn-secondary" style={{ marginTop: '1.25rem', justifyContent: 'center' }}>
          Mark as Received and Update Health Record <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
