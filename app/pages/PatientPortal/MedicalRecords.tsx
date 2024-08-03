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
    prescription_renewal_date:string;
    diagnosis_notes:string;
    diagnosis_date:string;
    diagnosis_treatment_plan:string;
    treatment_plan:string;
    blood_pressure:string;
    protein_in_urine:string;
    cholesterol:string;
    ecg_result:string;
    creatinine:string;
    ldl:string;
    hdl:string;
    HbA1c:string;
    potassium:string;

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
        return <div  className="error">Error: {error}</div>;
    }

    return (
      <div className="medical-records-container">
      <h1 className="medical-records-title">Medical Records</h1>
      {records.length === 0 ? (
        <p className="no-records">No records found.</p>
      ) : (
        <div className="grid-container" style={{placeItems:'normal'}}>
          {records.map((record) => (
            <React.Fragment key={record.id}>
              <div className="medical-record-card">
                <h2 style={{color:'#000',padding:'1rem'}} className="card-title">Medication</h2>
                <div className="card-content">
                  <p><strong>Condition:</strong> {record.condition_name}</p>
                  <p><strong>Medication:</strong> {record.medication_name}</p>
                  <p><strong>Dosage:</strong> {record.dosage}</p>
                  <p><strong>Date Prescribed:</strong> {new Date(record.date_prescribed).toLocaleDateString()}</p>
                  <p><strong>Renewal Date:</strong> {new Date(record.prescription_renewal_date).toLocaleDateString()}</p>
                  <p><strong>Notes:</strong> {record.notes || 'N/A'}</p>
                </div>
              </div>
              
              <div className="medical-record-card">
                <h2 style={{color:'#000',padding:'1rem'}} className="card-title">Diagnosis</h2>
                <div className="card-content">
                  <p><strong>Diagnosis:</strong> {record.diagnosis}</p>
                  <p><strong>Date Diagnosed:</strong> {new Date(record.diagnosis_date).toLocaleDateString()}</p>
                  <p><strong>Treatment Plan:</strong> {record.diagnosis_treatment_plan || 'N/A'}</p>
                  <p><strong>Notes:</strong> {record.diagnosis_notes || 'N/A'}</p>
                </div>
              </div>

              <div className="medical-record-card">
                <h2 style={{color:'#000',padding:'1rem'}} className="card-title">Treament Plan</h2>
                <div className="card-content">
<p><strong>Treatment Plan:</strong> {record.treatment_plan}</p>
                </div>
              </div>

              <div className="medical-record-card"> 
                <h2 style={{color:'#000',padding:'1rem'}} className="card-title">Test Results</h2>
                <div className="card-content">
<p> <strong>Blood Pressure:</strong> {record.blood_pressure}</p>
<p> <strong>Protein in Urine:</strong> {record.protein_in_urine}</p>
<p> <strong>Cholesterol:</strong> {record.cholesterol}</p>
<p> <strong>ecg_result:</strong> {record.ecg_result}</p>
<p> <strong>Creatinine:</strong> {record.creatinine}</p>
<p> <strong>ldl:</strong> {record.ldl}</p>
<p> <strong>hdl:</strong> {record.hdl}</p>
<p> <strong>HbA1c:</strong> {record.HbA1c}</p>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
);
}