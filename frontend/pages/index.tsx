import React, { useRef } from 'react';
import StudentResult from '../components/first';
import first_dwarka from '../public/data/dwarka_first.json';
import first_meerabai from '../public/data/meerabai_first.json';
import { Student } from '../utils/interface';

function App() {
  const studentData = first_dwarka as Student[];
  // const studentData = first_meerabai as Student[];


  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <button 
        onClick={handlePrint} 
        style={{ marginBottom: '10px', padding: '10px', cursor: 'pointer' }} 
        className="no-print"
      >
        Print to PDF
      </button>
      <div ref={printRef}>
        {studentData.map((student: Student, index: number) => (
          <StudentResult key={index} student={student} />
        ))}
      </div>
      <style>{`
        @media print {
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
