import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { apiRequest } from "../services/api";
import { getCurrentUser } from "../utils/auth";
import "../Dashboard.css";
function DoctorDashboard(){
 const [appointments,setAppointments]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState("");
 useEffect(()=>{let active=true;apiRequest("/api/appointments/mine").then(d=>{if(active)setAppointments(d.appointments);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});return()=>{active=false;};},[]);
 const upcoming=appointments.filter(a=>a.status!=="cancelled" && new Date(`${a.date}T${a.time}:00`)>new Date()).sort((a,b)=>`${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
 return <Layout><header className="dashboard-header"><div className="header-title"><h1>ექიმის სამუშაო პანელი</h1><p>მოგესალმებით, {getCurrentUser()?.name}. აქ ჩანს მხოლოდ თქვენთან ჩაწერილი პაციენტები.</p></div></header><main className="dashboard-main"><section className="stats-section">{loading?<p>იტვირთება...</p>:error?<p role="alert">{error}</p>:<><div className="section-heading"><h2>მომავალი ვიზიტები: {upcoming.length}</h2><p>სულ ვიზიტები: {appointments.length}</p></div><div className="appointments-list">{upcoming.length===0?<p>ამჟამად მომავალი ვიზიტები არ არის.</p>:upcoming.map(a=><article className="appointment-row" key={a.id}><div className="appointment-patient"><strong>{a.patient_name}</strong><span>პაციენტი</span></div><div className="appointment-details"><span>{a.date}, {a.time}</span><span className="appointment-status confirmed">{a.status==="confirmed"?"დადასტურებული":a.status}</span></div></article>)}</div><section className="products-section"><h2>ვიზიტების ისტორია</h2><div className="appointments-list">{appointments.map(a=><article className="appointment-row" key={a.id}><div className="appointment-patient"><strong>{a.patient_name}</strong><span>{a.date}, {a.time}</span></div><span>{a.status}</span></article>)}</div></section></>}</section></main></Layout>;
}
export default DoctorDashboard;
