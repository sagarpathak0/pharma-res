import React from "react";
import Image from "next/image";
import { Student, Result, Subject } from "../utils/interface";

const StudentResultReappear = ({ student }: { student: Student }) => {
  const marks = student.result[0]?.marks || [];
  const month_year = student.result?.[0]?.marks?.[0]?.month_year || "June, 2024";
  // Identify failed subjects
  const failedSubjects = marks.filter(
    (subject) => parseInt(subject.marks_obtained) < 40
  );
  const failedCount = failedSubjects.length;

  // Check if "ER20-HF102" is one of the failed subjects
  const hasBackInSpecialCourse = failedSubjects.some(
    (subj) => subj.course_code === "ER20-HF102"
  );

  // Determine final result
  let resultText = "";
  if (failedCount === 0) {
    resultText = "PASS";
  } else if (
    (hasBackInSpecialCourse && failedCount <= 3) ||
    (!hasBackInSpecialCourse && failedCount <= 2)
  ) {
    resultText = `REAPPEAR in ${failedSubjects
      .map((subj) => subj.course_code)
      .join(", ")}`;
  } else {
    resultText = "FAIL";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 print:min-h-0 print:h-[1122px]">
      <div className="bg-white shadow-sm w-full max-w-3xl px-8 py-4 border border-gray-400 flex flex-col flex-1 print:h-full" style={{ minHeight: '1122px' }}>
        <br />

        {/* Logo and University Name */}
        <div className="mb-4 flex">
          <Image src="/dseulogo.png" alt="DSEU Logo" width={80} height={80} />
          <div className="text-center flex flex-col mx-auto mt-auto p-1 text-[#0072B9]">
            <div className="text-xl font-extrabold font-mono">
              दिल्ली कौशल एवं उद्यमिता विश्वविद्यालय
            </div>
            <div className="text-2xl font-extrabold font-serif">
              Delhi Skill & Entrepreneurship University
            </div>
            <div className="text-xs font-extrabold font-serif">
              (A State University Established under Govt. of NCT of Delhi Act 04 of 2020)
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-sm font-bold text-gray-800 ">
            STATEMENT OF MARKS
          </h1>
          <h2 className="text-lg font-serif font-bold text-gray-700">
            {student.program}
          </h2>
          <h2 className="text-md font-mono font-bold text-gray-700">
            First Year (REAPPEAR)
          </h2>
          <h2 className="text-md font-mono font-bold text-gray-700">
            Examination Held in {month_year}
          </h2>
        </div>

        {/* Student Info */}
        <div className="flex gap-6 mb-2 justify-between">
          <div className="flex gap-1 items-baseline">
            <p className="text-sm text-gray-500">Name of the Student:</p>
            <p className="text-gray-900 font-bold text-sm">{student.name}</p>
          </div>
          <div className="flex gap-1 items-baseline">
            <p className="text-sm text-gray-500">Enrollment No.:</p>
            <p className="text-gray-900 font-bold text-sm">{student.roll}</p>
          </div>
        </div>
        <div className="flex mb-3 gap-1 items-baseline">
          <p className="text-sm text-gray-500">Campus Name:</p>
          <p className="text-gray-900 font-bold text-sm">{student.campus}</p>
        </div>

        {/* Marks Table */}
        <div className="overflow-x-auto mb-2">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-white">
                <th className="border border-gray-200 px-1 font-serif py-2 text-[12px] text-center text-black">
                  S.No.
                </th>
                <th className="border border-gray-200 px-1 font-serif py-2 text-left text-[12px] text-black">
                  Course Code
                </th>
                <th className="border border-gray-200 px-1 font-serif py-2 text-left text-[12px] text-black">
                  Course Name
                </th>
                <th className="border border-gray-200 px-1 font-serif py-2 text-center text-[12px] text-black">
                  Max. Marks
                </th>
                <th className="border border-gray-200 px-1 font-serif py-2 text-center text-[12px] text-black">
                  Marks Obtained
                </th>
              </tr>
            </thead>
            <tbody>
              {[...(student.result[0]?.marks || [])]
                .filter((subject) => subject.marks_obtained && subject.marks_obtained.trim() !== "")
                .sort((a, b) => a.course_code.localeCompare(b.course_code))
                .map((subject, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 text-[12px] font-serif px-1 py-1 text-black text-center">
                      {index + 1}
                    </td>
                    <td className="border border-gray-200 text-[11px] font-mono px-1 py-1 text-black">
                      {subject.course_code}
                    </td>
                    <td className="border border-gray-200 text-[12px] font-serif px-1 py-1 text-black">
                      {subject.course_name}
                    </td>
                    <td className="border border-gray-200 text-[12px] font-mono px-1 py-1 text-black text-center">
                      100
                    </td>
                    <td className="border border-gray-200 text-[12px] font-mono px-1 py-1 text-black text-center">
                      {subject.marks_obtained}
                    </td>
                  </tr>
                ))}

              {/* Total Marks Row */}
              <tr className="bg-white font-semibold">
                <td
                  colSpan={3}
                  className="border border-gray-200 px-4 py-1 text-right font-serif text-black text-[12px]"
                >
                  TOTAL
                </td>
                <td className="border border-gray-200 px-4 py-1 text-black text-[12px] font-mono text-center">
                  {
                    (student.result[0]?.marks?.filter(
                      (subject) =>
                        subject.course_code !== "ER20-HF102" &&
                        subject.marks_obtained &&
                        subject.marks_obtained.trim() !== ""
                    ).length || 0) * 100
                  }
                </td>
                <td className="border border-gray-200 px-4 py-1 text-black text-[12px] font-mono text-center">
                  {student.result[0].marks
                    ?.filter(
                      (subject) =>
                        subject.course_code !== "ER20-HF102" &&
                        subject.marks_obtained &&
                        subject.marks_obtained.trim() !== ""
                    )
                    .reduce(
                      (acc, subject) =>
                        acc + parseInt(subject.marks_obtained),
                      0
                    )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Result Section */}
        <div className="mt-4">
          <div className="flex items-center">
            <span className="text-gray-700 text-sm font-medium">Result:</span>
            <span className="pl-2 py-1 font-bold text-gray-700 text-xs">
              {resultText}
            </span>
          </div>
        </div>

        {/* Instructions and Footer as a flex column with footer pushed to bottom */}
        <div className="flex flex-col flex-1 min-h-0 mt-8 mb-8">
          <div className="space-y-1 text-sm text-gray-600 mb-8">
            <h3 className="font-medium text-gray-700">Instructions:</h3>
            <ol className="list-decimal pl-4">
              <li>
                Students failed in more than two courses shall not be entitled for
                the diploma.
              </li>
              <li>
                Soft Skills Modules marks are not included in the calculation of
                total marks.
              </li>
              <li>
                Student has failed in either Face the World Skill or Soft Skills
                Modules or both is passed provisionally. Student should pass these
                two subjects compulsorily for award of the diploma.
              </li>
            </ol>
          </div>
          {/* Dynamic Spacer to push footer to bottom */}
          <div className="flex-1" />
          {/* Footer */}
          <div className="flex w-full gap-4 text-sm text-gray-600 justify-end print:pb-0 pb-2">
            <div className="mt-10 text-sm">
              <p className="font-bolder text-xs mb-1"></p>
              <p className="font-bolder text-sm mb-1 italic">
                Computer Generated Statement of Marks
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentResultReappear;