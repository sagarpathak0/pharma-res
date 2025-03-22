import React from 'react'
import StudentResult from './first'
import data from '../public/data/pharmacy_results.json'
import { Student , Result, Subject} from '../utils/interface'

function App() {
   const studentData = data as Student[];
  return (
    <>
      {studentData.map((student: Student) => (
        <StudentResult student={student} />
      ))}
    </>
  )
}

export default App