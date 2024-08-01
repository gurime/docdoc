import React, { useEffect, useState } from 'react';
import supabase from '@/app/Config/supabase';



interface Records {
    id: string;
    condition_name: string;
    medication_name: string;
    dosage: string;
    diagnosis: string;
    notes: string;
    date_prescribed: string;
    prescription_renewal_date:string

}
export default function MedicalRecords() {
    const [records, setRecords] = useState<Records[]>([]);
const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRecords = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                setError("User not authenticated");
                return;
            }

            const { data, error } = await supabase
                .from('medical_records')
                .select('*')
                .eq('patient_id', user.id);

            if (error) {
                console.error('Error fetching medical records:', error);
                setError(error.message);
            } else {
                setRecords(data);
            }
        };

        fetchRecords();
    }, []);

    if (error) {
        return <div  className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="medical-records-container">
        <h1 className="medical-records-title">Medical Records</h1>
        {records.length === 0 ? (
          <p className="no-records">No records found.</p>
        ) : (
          <div className="medical-records-grid">
            {records.map((record) => (
              <div key={record.id} className="medical-record-card">
                <h2 className="card-title">Medicine</h2>
                <div className="card-content">
                  <p><strong>Condition:</strong> {record.condition_name}</p>
                  <p><strong>Medication:</strong> {record.medication_name}</p>
                  <p><strong>Dosage:</strong> {record.dosage}</p>
                  <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                  <p><strong>Notes:</strong> {record.notes || 'N/A'}</p>
                  <p><strong>Date Prescribed:</strong> {new Date(record.date_prescribed).toLocaleDateString()}</p>
                  <p><strong>Renewal Date:</strong> {new Date(record.prescription_renewal_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
     
      </div>
);
}