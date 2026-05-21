import React, { useState, useRef, useEffect } from 'react';

const CustomSelect = ({ options, selected, setSelected, name, id, unit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getMaxAllowedValue = (unit) => {
    switch (unit) {
      case 'лет': return 2;
      case 'месяцев': return 12;
      case 'недель': return 10;
      case 'дней': return 30;
      default: return Infinity;
    }
  };

  const handleSelect = (value) => {
    setSelected(value);
    setIsOpen(false);
  };

  const filteredOptions = options.filter((opt) => {
    if (name !== 'number') return true;
    const max = getMaxAllowedValue(unit);
    return parseInt(opt) <= max;
  });

  return (
    <div className="custom-select" ref={ref}>
      <div
        className={`select-selected ${isOpen ? 'select-arrow-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        id={id}
      >
        {selected}
      </div>
      <div className={`select-items ${!isOpen ? 'select-hide' : ''}`}>
        <div className="select-items-list">
          {filteredOptions.map((opt) => (
            <div
              key={opt}
              data-value={opt}
              className={opt === selected ? 'same-as-selected' : ''}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </div>
          ))}
        </div>
      </div>
      <input type="hidden" name={name} id={id} value={selected} />
    </div>
  );
};

export default CustomSelect;