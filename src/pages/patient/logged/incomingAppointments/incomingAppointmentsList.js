import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import DataIncomingAppointments from "../../../../components/patient/DataIncomingAppointments";
import { Table } from "../../../../components/Table";
import { basicURL } from "../../../../Services";
import Auth from "../../../../services/Auth";

function IncomingApointments() {
  const COLUMNINCOMINGAPPOINTMENTS = [
    {
      Header: "Vaccine",
      accessor: "vaccineName",
    },
    {
      Header: "Company",
      accessor: "vaccineCompany",
    },
    {
      Header: "Vaccination center",
      accessor: "vaccinationCenterName",
    },
    {
      Header: "Dose",
      accessor: "whichVaccineDose",
    },
    {
      Header: "Begin",
      accessor: "windowBegin",
    },
    {
      Header: "End",
      accessor: "windowEnd",
    },
    {
      Header: "Options",
      accessor: "action",
      Cell: (row) => (
        <div>
          <div className="row">
            <div className="col text-center">
              <Button
                variant="info"
                onClick={() => {
                  setIncomingAppointment(row.row.original);
                  setModalShowInfo(true);
                }}
              >
                Info
              </Button>
            </div>
            <div className="col text-center">
              <Button
                variant="danger"
                onClick={() => cancelHandler(row.row.original.appointmentId)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  async function cancelHandler(appointmentId) {
    const userId = Auth.getUserId();
    const token = Auth.getFullToken();
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      const response = await fetch(
        basicURL +
          "/patient/appointments/incomingAppointments/cancelAppointments/" +
          userId +
          "/" +
          appointmentId,
        {
          method: "DELETE",
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        const newAppointments = loadedIncomingAppointment.filter(
          (appointment) => appointment.appointmentId !== appointmentId
        );
        setLoadedIncomingAppointment(newAppointments);
      }
    }
  }

  const [isLoading, setIsLoading] = useState(true);
  const [loadedIncomingAppointment, setLoadedIncomingAppointment] = useState(
    []
  );
  const [modalShowinfo, setModalShowInfo] = useState(false);
  const [incomingAppointment, setIncomingAppointment] = useState({});
  const [errors, setErrors] = useState("");

  async function fetchData() {
    const userId = Auth.getUserId();
    const token = Auth.getFullToken();
    const response = await fetch(
      basicURL + "/patient/appointments/incomingAppointments/" + userId,
      {
        headers: { Authorization: token },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      const incomingAppointments = [];

      for (const key in data) {
        const incomingAppointment = { id: key, ...data[key] };
        incomingAppointments.push(incomingAppointment);
      }
      setLoadedIncomingAppointment(incomingAppointments);
    } else {
      setErrors(response.statusText);
    }
  }

  useEffect(() => {
    setIsLoading(true);
    fetchData();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <section className="text-center">
        <p>Loading...</p>
      </section>
    );
  }

  return (
    <div>
      <section className="text-center text-danger">
        <p>{errors}</p>
      </section>
      <Container className="mt-4">
        <Table
          columns={COLUMNINCOMINGAPPOINTMENTS}
          data={loadedIncomingAppointment}
        />
      </Container>
      <DataIncomingAppointments
        incomingAppointment={incomingAppointment}
        show={modalShowinfo}
        onHide={() => setModalShowInfo(false)}
      />
    </div>
  );
}

export default IncomingApointments;
