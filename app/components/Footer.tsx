'use client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import footLogo from '../img/doc_photo.png'
import Image from 'next/image'
import navlogo from '../img/doc_care.png'

const Footer = () => {
const router = useRouter()
const scrollTo = () =>{
window.scroll({top: 0,})
}  

return (
<>


<footer>
  <div className="flex-footer">
    
    <div className="footer-tablebox">
      <div className="footer-headline">Get To Know Us</div>
      <ul className="footer-navlink">
        <li><Link href='#!'>About Us</Link></li>
        <li><Link href='#!'>Our History</Link></li>
        <li><Link href='#!'>Leadership</Link></li>
        <li><Link href='#!'>Careers</Link></li>
        <li><Link href='#!'>News & Events</Link></li>
      </ul>
    </div>
    
    <div className="footer-tablebox"> 
      <div className="footer-headline">Patient Care</div>
      <ul className="footer-navlink">
        <li><Link href='#!'>Find a Doctor</Link></li>
        <li><Link href='#!'>Patient Portal</Link></li>
        <li><Link href='#!'>Appointments</Link></li>
        <li><Link href='#!'>Billing & Insurance</Link></li>
        <li><Link href='#!'>Patient Resources</Link></li>
        <li><Link href='#!'>Visitor Information</Link></li>
      </ul>
    </div>
    
    <div className="footer-tablebox"> 
      <div className="footer-headline">Services</div>
      <ul className="footer-navlink">
        <li><Link href='#!'>Emergency Services</Link></li>
        <li><Link href='#!'>Primary Care</Link></li>
        <li><Link href='#!'>Specialty Care</Link></li>
        <li><Link href='#!'>Surgery</Link></li>
        <li><Link href='#!'>Maternity</Link></li>
        <li><Link href='#!'>Pediatrics</Link></li>
        <li><Link href='#!'>Mental Health</Link></li>
      </ul>
    </div>
    
    <div className="footer-tablebox" style={{borderRight:'none'}}> 
      <div className="footer-headline">Health Information</div>
      <ul className="footer-navlink">
        <li><Link href='#!'>Health Library</Link></li>
        <li><Link href='#!'>Wellness Programs</Link></li>
        <li><Link href='#!'>Nutrition & Fitness</Link></li>
        <li><Link href='#!'>Support Groups</Link></li>
        <li><Link href='#!'>Classes & Events</Link></li>
      </ul>
    </div>
    
    <div className="footer-tablebox" style={{borderRight:'none',borderLeft:'solid 1px #fff'}}> 
      <div className="footer-headline">Contact Us</div>
      <ul className="footer-navlink" style={{borderBottom:'none'}}>
        <li><Link href='#!'>Contact Information</Link></li>
        <li><Link href='#!'>Locations</Link></li>
        <li><Link href='#!'>Feedback</Link></li>
        <li><Link href='#!'>Volunteer</Link></li>
        <li><Link href='#!'>Donate</Link></li>
      </ul>
    </div>
    
  </div>



<div  className="nav">
<Image title='Home Page' style={{marginRight:'auto '}} onClick={() => router.push('/')} src={navlogo} width={140} alt='...'  />






<div className="navlinks sm-navlink" style={{flexWrap:'nowrap'}}>
<Link  href='/pages/Contact'>Contact Doctor Care</Link>

<Link  href='/pages/Terms'>terms of Use</Link>

<Link  href='/pages/Privacy'>Privacy Policies </Link>

<Link style={{border:'none'}}  href='../pages/Cookie'>Cookie Policies</Link>


</div>
</div>





<hr />
<div style={{
color:'#fff',
padding:'1rem 0',
textAlign:'center'
}}>
   &#169;{new Date().getFullYear()} Doctor Care, LLC All Rights Reserved <br />

</div>
<hr />

<div style={{
color:'#fff',
padding:'1rem 0',
textAlign:'center'
}}>
   <br />
    This material may not be published, broadcast, rewritten, or redistributed. 
</div>


<div className="footer-logo-box">

<Image title='To Top' width={36} onClick={scrollTo}  src={footLogo} alt="..." />

</div>
</footer>






</>
)
}

export default Footer