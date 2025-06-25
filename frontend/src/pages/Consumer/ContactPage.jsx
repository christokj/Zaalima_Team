import React, { useContext } from 'react';
// import '../../styles/ContactPage.css';
// import ContactForm from '../../components/Home/ContactForm';
// import SocialMedia from '../../components/Home/SocialMedia';
// import { MyContext } from '../../components/Context/Context';

function ContactPage() {

    const { value, setValue } = useContext(MyContext);
    return (
        <div className={`md:flex mt-24 mb-10 ${!value && "bg-gray-50"}`}>
            <div className='w-full mx-auto '>
                {/* <ContactForm /> */}
            </div>
            <div className='w-9/12 mx-auto mt-5'>
                {/* <SocialMedia /> */}
            </div>

        </div>
    );
}

export default ContactPage;