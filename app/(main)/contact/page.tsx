import TextInput from '@/components/ui/TextInput';
import TextAreaInput from '@/components/ui/TextAreaInput';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Contact Us</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <p className="text-gray-700 mb-6">Have questions, feedback, or want to partner with us? Reach out!</p>
        <form>
          <div className="mb-5">
            <TextInput 
              label="Name" 
              id="name" 
              name="name" 
            />
          </div>
          <div className="mb-5">
            <TextInput 
              label="Email" 
              id="email" 
              name="email" 
              type="email" 
            />
          </div>
          <div className="mb-6">
            <TextAreaInput 
              label="Message" 
              id="message" 
              name="message" 
              rows={5} 
            />
          </div>
          <button type="submit" aria-label="Send Message" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
