import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStudentFields } from "../../redux/studentRelated/studentHandle";
import Popup from "../../components/Popup";

const TeacherViewClassAttendance = () => {
  const dispatch = useDispatch();

  const { sclassStudents, response, loading, error } = useSelector(
    (state) => state.sclass
  );
  const { currentUser } = useSelector((state) => state.user);

  const subjectID = currentUser.teachSubject?._id;

  if (response) {
    console.log(response);
  } else if (error) {
    console.log(error);
  }

  const [attendanceData, setAttendanceData] = useState(
    sclassStudents?.map((student) => ({
      ...student,
      present: false,
      absent: false,
    }))
  );

  const [showPopup, setShowPopup] = useState(false);
  const [date, setDate] = React.useState(false);

  const handleCheckboxChange = (index, field, value) => {
    if (!date) {
      setShowPopup(true);
      return;
    }

    let studentID = attendanceData[index]._id;
    let status = field === "present" ? "Present" : "Absent";

    const fields = { subName: subjectID, status, date };
    dispatch(updateStudentFields(studentID, fields, "StudentAttendance"));

    setAttendanceData((prevData) =>
      prevData.map((student, i) => {
        if (i === index) {
          return { ...student, [field]: !student[field] };
        }
        return student;
      })
    );
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);

    const updatedAttendanceData = attendanceData.map((student) => {
      const attendanceForDate = student.attendance.find(
        (entry) =>
          new Date(entry.date).toISOString().split("T")[0] ===
          event.target.value
      );

      // If attendance data for the selected date is found
      if (attendanceForDate) {
        // Check if the status is Present
        if (attendanceForDate.status === "Present") {
          return { ...student, present: true, absent: false };
        }
        // Check if the status is Absent
        else if (attendanceForDate.status === "Absent") {
          return { ...student, present: false, absent: true };
        }
      } else {
        return { ...student, present: false, absent: false };
      }

      // If attendance data for the selected date is not found
      // or if the status is neither Present nor Absent
      // Keep the present and absent properties unchanged
      return student;
    });

    // Update the state with the modified attendance data
    setAttendanceData(updatedAttendanceData);
  };

  return (
    <>
      {loading ? (
        <>
          <div>Loading...</div>
        </>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "2%",
          }}
        >
          <h3>
            Attendance for{" "}
            <input
              type="date"
              className="registerInput"
              placeholder="Select attendance date"
              value={date}
              onChange={handleDateChange}
              required
            />
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Roll No
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Present
                </th>
                <th
                  style={{
                    border: "1px solid #dddddd",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Absent
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((student, index) => (
                <tr key={student._id}>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {student.rollNum}
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    {student.name}
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={student.present}
                      onChange={(e) => {
                        if (e.target.checked) {
                          student.absent = false;
                        }
                        handleCheckboxChange(index, "present", student.present);
                      }}
                    />
                  </td>
                  <td
                    style={{
                      border: "1px solid #dddddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={student.absent}
                      onChange={(e) => {
                        if (e.target.checked) {
                          student.present = false;
                        }
                        handleCheckboxChange(index, "absent", student.absent);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <br />
          <br />
          <br />
        </div>
      )}

      <Popup
        message={"Please select date first to mark attendance!"}
        setShowPopup={setShowPopup}
        showPopup={showPopup}
      />
    </>
  );
};

export default TeacherViewClassAttendance;
