import { Loader } from 'lucide-react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newCode = [...code];
    newCode[index] = value.slice(-1); // Limit input to one character
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = ''; // Clear previous field value
      setCode(newCode);
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const codeValue = code.join('');
    console.log("Code entered:", codeValue);

    try {
      // Simulated success
      if (codeValue === "123456") {
        navigate('/');
      } else {
        throw new Error("Invalid verification code.");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen font-sans  flex items-center justify-center bg-gray-200">
      <div className="relative w-full max-w-md bg-opacity-90 bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-gradient-to-r from-[#00ffff] to-[#ff0080] bg-clip-text mb-4">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-800 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        {error && (
          <div
            role="alert"
            className="text-red-500 text-center font-semibold mb-4 bg-red-100 p-3 rounded-lg"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-4">
            {code.map((item, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="1"
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-2xl text-center font-bold bg-gray-200 border-2 rounded-md focus:outline-none focus:border-[#0ef] transition-all"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 py-3 text-xl font-bold text-white text-center rounded-full transition-all ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#0ef] to-[#c800ff] hover:from-[#0ef] hover:to-[#ff66c4]"
            }`}
          >
            {loading ? <Loader className="w-6 h-6 animate-spin mx-auto" /> : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;
