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
    let status = value === true ? "Present" : "Absent";

    const fields = { subName: subjectID, status, date };

    setAttendanceData((prevData) =>
      prevData.map((student, i) => {
        if (i === index) {
          dispatch(updateStudentFields(studentID, fields, "StudentAttendance"));
          return { ...student, [field]: !student[field] };
        }
        return student;
      })
    );
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
              onChange={(event) => setDate(event.target.value)}
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
