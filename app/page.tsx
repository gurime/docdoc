import { Metadata } from "next";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";

export const metadata: Metadata = {
  title: 'Doctor Care',
  description: 'Explore Doctor Care to find detailed information about physicians, patient resources, and healthcare services. Connect with medical professionals and access valuable healthcare information.',
  keywords: 'physicians, patient information, healthcare, medical professionals, doctor profiles, healthcare services, medical information'
};

export default function Home() {
  return (
    <>
<Navbar/>
<HomePage/>
<Footer/>
    </>
  );
}
