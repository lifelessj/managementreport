import React, { useState } from "react";
import { Plus, Trash2, Edit2, Printer, Eye, EyeOff } from "lucide-react";

const SchoolReportSystem = () => {
  const [workbooks, setWorkbooks] = useState([]);
  const [currentWorkbookId, setCurrentWorkbookId] = useState(null);
  const [showNewWorkbookModal, setShowNewWorkbookModal] = useState(false);
  const [newWorkbookName, setNewWorkbookName] = useState("");
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [editingSheet, setEditingSheet] = useState(null);

  const mainSubjects = ["ENGLISH", "MATHEMATICS", "SCIENCE", "SOCIAL STUDIES"];
  const otherSubjects = ["COMPUTER STUDIES"];
  const teacherInitials = {
    ENGLISH: "N.R",
    MATHEMATICS: "I.D",
    SCIENCE: "K.R",
    "SOCIAL STUDIES": "K.R",
    "COMPUTER STUDIES": "B.M",
  };

  const behaviorOptions = ["VERY GOOD", "GOOD", "FAIR", "POOR"];

  const gradeRanges = [
    { grade: "D1", range: "100-95", min: 95, max: 100 },
    { grade: "D2", range: "94-85", min: 85, max: 94 },
    { grade: "C3", range: "84-75", min: 75, max: 84 },
    { grade: "C4", range: "74-65", min: 65, max: 74 },
    { grade: "C5", range: "64-55", min: 55, max: 64 },
    { grade: "C6", range: "54-50", min: 50, max: 54 },
    { grade: "P7", range: "49-45", min: 45, max: 49 },
    { grade: "P8", range: "44-40", min: 40, max: 44 },
    { grade: "F9", range: "39-0", min: 0, max: 39 },
  ];

  const getGrade = (marks) => {
    if (!marks) return "N/A";
    const range = gradeRanges.find((r) => marks >= r.min && marks <= r.max);
    return range ? range.grade : "N/A";
  };

  const getRemark = (marks) => {
    if (!marks) return "N/A";
    if (marks >= 75) return "EXCELLENT";
    if (marks >= 60) return "GOOD";
    if (marks >= 50) return "FAIR";
    return "IMPROVE";
  };

  const getDivision = (aggregate) => {
    if (!aggregate) return "N/A";
    if (aggregate >= 90) return "DIVISION 1";
    if (aggregate >= 80) return "DIVISION 2";
    if (aggregate >= 70) return "DIVISION 3";
    if (aggregate >= 60) return "DIVISION 4";
    return "DIVISION 5";
  };

  const createNewWorkbook = () => {
    if (newWorkbookName.trim()) {
      const workbook = {
        id: Date.now(),
        name: newWorkbookName,
        sheets: [],
        createdAt: new Date().toLocaleDateString(),
      };
      setWorkbooks([...workbooks, workbook]);
      setCurrentWorkbookId(workbook.id);
      setNewWorkbookName("");
      setShowNewWorkbookModal(false);
    }
  };

  const addSheet = () => {
    if (currentWorkbookId) {
      const newSheet = {
        id: Date.now(),
        studentName: "",
        class: "P1",
        term: "TERM 1",
        year: new Date().getFullYear(),
        socialEmotional: {
          responsibility: "GOOD",
          teamwork: "GOOD",
          careForProperty: "GOOD",
        },
        mainSubjects: mainSubjects.map((subject) => ({
          subject,
          marks: "",
          remarks: "GOOD",
          initials: teacherInitials[subject],
        })),
        otherSubjects: otherSubjects.map((subject) => ({
          subject,
          marks: "",
          remarks: "GOOD",
          initials: teacherInitials[subject],
        })),
        pupilConduct: "GOOD",
        classTeacherComment: "",
        headTeacherComment: "",
        nextTermStart: "16TH SEPTEMBER 2024",
        nextTermEnd: "28TH NOVEMBER 2024",
      };

      setWorkbooks(
        workbooks.map((wb) => {
          if (wb.id === currentWorkbookId) {
            return { ...wb, sheets: [...wb.sheets, newSheet] };
          }
          return wb;
        })
      );
      setSelectedSheetId(newSheet.id);
    }
  };

  const updateSheet = (updates) => {
    setWorkbooks(
      workbooks.map((wb) => {
        if (wb.id === currentWorkbookId) {
          return {
            ...wb,
            sheets: wb.sheets.map((sheet) => {
              if (sheet.id === selectedSheetId) {
                return { ...sheet, ...updates };
              }
              return sheet;
            }),
          };
        }
        return wb;
      })
    );
  };

  const updateSubjectMarks = (sheetId, subjectType, index, marks) => {
    setWorkbooks(
      workbooks.map((wb) => {
        if (wb.id === currentWorkbookId) {
          return {
            ...wb,
            sheets: wb.sheets.map((sheet) => {
              if (sheet.id === sheetId) {
                const updated = { ...sheet };
                if (subjectType === "main") {
                  updated.mainSubjects[index] = {
                    ...updated.mainSubjects[index],
                    marks: marks ? parseInt(marks) : "",
                    remarks: getRemark(marks),
                  };
                } else {
                  updated.otherSubjects[index] = {
                    ...updated.otherSubjects[index],
                    marks: marks ? parseInt(marks) : "",
                    remarks: getRemark(marks),
                  };
                }
                return updated;
              }
              return sheet;
            }),
          };
        }
        return wb;
      })
    );
  };

  const deleteSheet = (sheetId) => {
    setWorkbooks(
      workbooks.map((wb) => {
        if (wb.id === currentWorkbookId) {
          const updatedSheets = wb.sheets.filter((s) => s.id !== sheetId);
          return { ...wb, sheets: updatedSheets };
        }
        return wb;
      })
    );
    setSelectedSheetId(null);
    setEditingSheet(null);
  };

  const deleteWorkbook = (workbookId) => {
    setWorkbooks(workbooks.filter((wb) => wb.id !== workbookId));
    if (currentWorkbookId === workbookId) {
      setCurrentWorkbookId(null);
      setSelectedSheetId(null);
    }
  };

  const currentWorkbook = workbooks.find((wb) => wb.id === currentWorkbookId);
  const currentSheet = currentWorkbook?.sheets.find(
    (s) => s.id === selectedSheetId
  );

  const calculateMainSubjectsStats = () => {
    if (!currentSheet) return { total: 0, avg: 0, division: "N/A" };
    const marks = currentSheet.mainSubjects
      .filter((s) => s.marks)
      .map((s) => s.marks);
    const total = marks.reduce((a, b) => a + b, 0);
    const avg = marks.length > 0 ? Math.round(total / marks.length) : 0;
    return { total, avg, division: getDivision(avg) };
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-300 overflow-y-auto">
        <div className="p-4 border-b border-gray-300">
          <button
            onClick={() => setShowNewWorkbookModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            <Plus size={18} /> New Workbook
          </button>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-700 mb-3">Workbooks</h3>
          {workbooks.map((wb) => (
            <div
              key={wb.id}
              className={`mb-2 p-2 rounded cursor-pointer border-2 ${
                currentWorkbookId === wb.id
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400"
              }`}
              onClick={() => {
                setCurrentWorkbookId(wb.id);
                setSelectedSheetId(null);
              }}
            >
              <div className="flex justify-between items-start">
                <div className="text-sm font-semibold text-gray-800 flex-1">
                  {wb.name}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteWorkbook(wb.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {wb.sheets.length} sheets
              </div>

              {currentWorkbookId === wb.id && (
                <div className="mt-3 border-t pt-3">
                  <button
                    onClick={() => addSheet()}
                    className="w-full text-xs py-1 bg-green-600 text-white rounded hover:bg-green-700 mb-2"
                  >
                    + Add Sheet
                  </button>
                  {wb.sheets.map((sheet) => (
                    <div
                      key={sheet.id}
                      className={`text-xs p-2 rounded mb-1 flex justify-between items-center ${
                        selectedSheetId === sheet.id
                          ? "bg-green-200 border border-green-600"
                          : "bg-gray-200 hover:bg-gray-300"
                      } cursor-pointer`}
                      onClick={() => setSelectedSheetId(sheet.id)}
                    >
                      <span>{sheet.studentName || "Untitled Sheet"}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSheet(sheet.id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {showNewWorkbookModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4">Create New Workbook</h2>
              <input
                type="text"
                placeholder="Workbook name"
                value={newWorkbookName}
                onChange={(e) => setNewWorkbookName(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                onKeyPress={(e) => e.key === "Enter" && createNewWorkbook()}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowNewWorkbookModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={createNewWorkbook}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {currentSheet ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Report Sheet</h2>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <Printer size={18} /> Print
              </button>
            </div>

            {/* Report Sheet - Printable */}
            <div
              id="report-sheet"
              className="bg-white p-12 shadow-lg relative mx-auto"
              style={{ width: "8.5in", minHeight: "11in" }}
            >
              {/* Watermark */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none"
                style={{ fontSize: "180px", fontWeight: "bold", color: "gray" }}
              >
                ◎
              </div>

              {/* Header */}
              <div className="text-center border-b-2 border-gray-400 pb-3 mb-4 relative z-10">
                <h1 className="text-xl font-bold">
                  ST JAMES NKUMBA DAY AND BOARDING PRIMARY SCHOOL - MPALA
                </h1>
                <p className="text-xs text-gray-700 mt-1">
                  P.O BOX 86 ABATTA ABASEJI ENTERRE
                </p>
                <p className="text-xs text-gray-700">
                  Tel: 0772-997656 | 0712-647732 | 0772-327842 | 0702-897656
                </p>
                <p className="text-xs text-gray-700">
                  E-MAIL: stjamesnkumba@gmail.com
                </p>
                <p className="text-xs text-gray-700">
                  Website: www.stjamesprimaryschool-mpala.ac.ug
                </p>
                <div className="mt-2 text-xs font-bold text-red-700 italic">
                  WITH GOD ALL IS POSSIBLE
                </div>
              </div>

              <div className="text-center mb-4 font-bold text-sm bg-blue-200 py-1">
                ASSESSMENT SHEET
              </div>

              {/* Student Info */}
              <div className="mb-4 text-sm relative z-10">
                <div className="flex justify-between mb-2">
                  <span>
                    <strong>Name:</strong>
                    <input
                      type="text"
                      value={currentSheet.studentName}
                      onChange={(e) =>
                        updateSheet({ studentName: e.target.value })
                      }
                      className="border-b border-gray-400 ml-2 w-48"
                    />
                  </span>
                  <span>
                    <strong>Class:</strong>
                    <select
                      value={currentSheet.class}
                      onChange={(e) => updateSheet({ class: e.target.value })}
                      className="border-b border-gray-400 ml-2"
                    >
                      {["P1", "P2", "P3", "P4", "P5", "P6", "P7"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </span>
                  <span>
                    <strong>Term:</strong>
                    <select
                      value={currentSheet.term}
                      onChange={(e) => updateSheet({ term: e.target.value })}
                      className="border-b border-gray-400 ml-2"
                    >
                      {["TERM 1", "TERM 2", "TERM 3"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </span>
                </div>
              </div>

              {/* Social and Emotional Development */}
              <div className="mb-4 text-sm relative z-10">
                <table className="w-full border-collapse border border-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-600 p-2 text-left font-bold">
                        SOCIAL AND EMOTIONAL DEVELOPMENT
                      </th>
                      <th className="border border-gray-600 p-2 text-left font-bold w-40">
                        REMARKS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-600 p-2">
                        1. Sense of responsibility
                      </td>
                      <td className="border border-gray-600 p-2">
                        <select
                          value={currentSheet.socialEmotional.responsibility}
                          onChange={(e) =>
                            updateSheet({
                              socialEmotional: {
                                ...currentSheet.socialEmotional,
                                responsibility: e.target.value,
                              },
                            })
                          }
                          className="w-full"
                        >
                          {behaviorOptions.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 p-2">
                        2. Teamwork
                      </td>
                      <td className="border border-gray-600 p-2">
                        <select
                          value={currentSheet.socialEmotional.teamwork}
                          onChange={(e) =>
                            updateSheet({
                              socialEmotional: {
                                ...currentSheet.socialEmotional,
                                teamwork: e.target.value,
                              },
                            })
                          }
                          className="w-full"
                        >
                          {behaviorOptions.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="border border-gray-600 p-2">
                        3. Care for personal and school property
                      </td>
                      <td className="border border-gray-600 p-2">
                        <select
                          value={currentSheet.socialEmotional.careForProperty}
                          onChange={(e) =>
                            updateSheet({
                              socialEmotional: {
                                ...currentSheet.socialEmotional,
                                careForProperty: e.target.value,
                              },
                            })
                          }
                          className="w-full"
                        >
                          {behaviorOptions.map((opt) => (
                            <option key={opt}>{opt}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="text-sm font-bold text-green-700 mb-2 relative z-10">
                ACADEMIC PROGRESS
              </div>

              {/* Other Subjects */}
              <div className="mb-3 text-sm relative z-10">
                <table className="w-full border-collapse border border-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-600 p-2 text-left font-bold w-40">
                        OTHER SUBJECTS
                      </th>
                      <th className="border border-gray-600 p-2 font-bold">
                        MARKS
                      </th>
                      <th className="border border-gray-600 p-2 font-bold">
                        AGG
                      </th>
                      <th className="border border-gray-600 p-2 font-bold">
                        REMARKS
                      </th>
                      <th className="border border-gray-600 p-2 font-bold w-20">
                        INITIALS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSheet.otherSubjects.map((subj, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-600 p-2">
                          {subj.subject}
                        </td>
                        <td className="border border-gray-600 p-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={subj.marks}
                            onChange={(e) =>
                              updateSubjectMarks(
                                selectedSheetId,
                                "other",
                                idx,
                                e.target.value
                              )
                            }
                            className="w-16 text-center"
                          />
                        </td>
                        <td className="border border-gray-600 p-2 text-center">
                          {getGrade(subj.marks)}
                        </td>
                        <td className="border border-gray-600 p-2 text-center">
                          {subj.remarks}
                        </td>
                        <td className="border border-gray-600 p-2 text-center text-xs">
                          {subj.initials}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Main Subjects */}
              <div className="mb-3 text-sm relative z-10">
                <table className="w-full border-collapse border border-gray-600">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border border-gray-600 p-2 text-left font-bold w-40">
                        MAIN SUBJECTS
                      </th>
                      <th className="border border-gray-600 p-2 font-bold">
                        MARKS GAINED
                      </th>
                      <th className="border border-gray-600 p-2 font-bold">
                        AGG
                      </th>
                      <th className="border border-gray-600 p-2 font-bold">
                        REMARKS
                      </th>
                      <th className="border border-gray-600 p-2 font-bold w-20">
                        INITIALS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSheet.mainSubjects.map((subj, idx) => (
                      <tr key={idx}>
                        <td className="border border-gray-600 p-2">
                          {subj.subject}
                        </td>
                        <td className="border border-gray-600 p-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={subj.marks}
                            onChange={(e) =>
                              updateSubjectMarks(
                                selectedSheetId,
                                "main",
                                idx,
                                e.target.value
                              )
                            }
                            className="w-20 text-center"
                          />
                        </td>
                        <td className="border border-gray-600 p-2 text-center">
                          {getGrade(subj.marks)}
                        </td>
                        <td className="border border-gray-600 p-2 text-center text-xs">
                          {subj.remarks}
                        </td>
                        <td className="border border-gray-600 p-2 text-center text-xs">
                          {subj.initials}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td className="border border-gray-600 p-2">TOTAL</td>
                      <td className="border border-gray-600 p-2 text-center">
                        {calculateMainSubjectsStats().total}
                      </td>
                      <td className="border border-gray-600 p-2 text-center">
                        {calculateMainSubjectsStats().avg}
                      </td>
                      <td className="border border-gray-600 p-2 text-center">
                        {calculateMainSubjectsStats().division}
                      </td>
                      <td className="border border-gray-600 p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Grade Analysis */}
              <div className="mb-3 text-sm relative z-10">
                <div className="font-bold mb-2">Grade Analysis</div>
                <table className="w-full border-collapse border border-gray-600 text-xs">
                  <thead>
                    <tr className="bg-gray-200">
                      {gradeRanges.map((gr) => (
                        <th
                          key={gr.grade}
                          className="border border-gray-600 p-1 font-bold"
                        >
                          {gr.grade}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {gradeRanges.map((gr) => (
                        <td
                          key={gr.grade}
                          className="border border-gray-600 p-1 text-center"
                        >
                          {gr.range}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Comments Section */}
              <div className="mb-3 text-sm relative z-10">
                <div className="mb-2">
                  <strong>Pupil's Conduct:</strong>
                  <select
                    value={currentSheet.pupilConduct}
                    onChange={(e) =>
                      updateSheet({ pupilConduct: e.target.value })
                    }
                    className="ml-2 border border-gray-400"
                  >
                    {behaviorOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-2">
                  <strong>Class Teacher's comment:</strong>
                  <textarea
                    value={currentSheet.classTeacherComment}
                    onChange={(e) =>
                      updateSheet({ classTeacherComment: e.target.value })
                    }
                    className="w-full border border-gray-400 p-1 text-xs"
                    rows="2"
                  />
                </div>

                <div className="mb-2">
                  <strong>Head Teacher's comment:</strong>
                  <textarea
                    value={currentSheet.headTeacherComment}
                    onChange={(e) =>
                      updateSheet({ headTeacherComment: e.target.value })
                    }
                    className="w-full border border-gray-400 p-1 text-xs"
                    rows="2"
                  />
                </div>

                <div className="flex gap-4 text-xs">
                  <span>
                    <strong>Next term begins on:</strong>
                    <input
                      type="text"
                      value={currentSheet.nextTermStart}
                      onChange={(e) =>
                        updateSheet({ nextTermStart: e.target.value })
                      }
                      className="border-b border-gray-400 ml-1 w-32"
                    />
                  </span>
                  <span>
                    <strong>and ends on:</strong>
                    <input
                      type="text"
                      value={currentSheet.nextTermEnd}
                      onChange={(e) =>
                        updateSheet({ nextTermEnd: e.target.value })
                      }
                      className="border-b border-gray-400 ml-1 w-32"
                    />
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4 pt-3 border-t border-gray-600 text-xs font-bold italic text-red-700 relative z-10">
                WITH GOD ALL IS POSSIBLE
              </div>
            </div>

            <style>{`
              @media print {
                body {
                  margin: 0;
                  padding: 0;
                }
                #report-sheet {
                  box-shadow: none !important;
                  page-break-after: always;
                  margin: 0 !important;
                  padding: 0.5in !important;
                }
                button, .sidebar, .flex.justify-between {
                  display: none !important;
                }
              }
            `}</style>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">
                Select or create a workbook and sheet to begin
              </p>
              <p className="text-sm">
                Create a new workbook from the sidebar, then add sheets to it
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SchoolReportSystem;
