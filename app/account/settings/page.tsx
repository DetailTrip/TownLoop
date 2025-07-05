import TextInput from '@/components/ui/TextInput';
import SelectInput from '@/components/ui/SelectInput';
import { towns } from '@/constants';

export default function AccountSettingsPage() {
  const townOptions = towns.map(town => ({ value: town, label: town }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Account Settings</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <form>
          <div className="mb-5">
            <TextInput 
              label="Name" 
              id="name" 
              name="name" 
              value="John Doe" 
            />
          </div>
          <div className="mb-5">
            <TextInput 
              label="Email" 
              id="email" 
              name="email" 
              type="email" 
              value="john.doe@example.com" 
            />
          </div>
          <div className="mb-6">
            <SelectInput 
              label="Default Town" 
              id="defaultTown" 
              name="defaultTown" 
              options={townOptions}
              value="Timmins" // Placeholder value
            />
          </div>
          <button type="submit" aria-label="Save Changes" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
