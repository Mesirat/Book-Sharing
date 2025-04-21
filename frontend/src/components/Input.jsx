const Input = ({ label, type, value, onChange, placeholder, required }) => {
    return (
      <div className="mb-6">
        <label
          htmlFor={label}
          className="block text-sm lg:text-lg font-semibold text-gray-700 mb-2"
        >
          {label}
        </label>
        <input
          id={label}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-gray-100 rounded-3xl p-4 text-lg text-gray-700 outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition"
        />
      </div>
    );
  };
  
  export default Input;
  