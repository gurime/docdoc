import React from 'react'
interface AppointentComponentProps {
    articleId: string;
  }

const AppointmentComponent: React.FC<AppointentComponentProps> = ({ articleId }) => {
    return <>
      <button className="bookAppointmentButton">Book an Appointment</button>

    </>;
}

export default AppointmentComponent