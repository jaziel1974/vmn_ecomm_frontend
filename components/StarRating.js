import { useState, useEffect } from 'react';

export default function StarRating({ value = 0, onChange, size = 24, readOnly = false }) {
    const [rating, setRating] = useState(value);

    useEffect(() => setRating(value), [value]);

    function handleSet(v) {
        if (readOnly) return;
        setRating(v);
        if (onChange) onChange(v);
    }

    const stars = [1, 2, 3, 4, 5];
    return (
        <div style={{ display: 'inline-block', lineHeight: 1 }}>
            {stars.map((s) => (
                <span
                    key={s}
                    onClick={() => handleSet(s)}
                    onMouseEnter={() => !readOnly && setRating(s)}
                    onMouseLeave={() => !readOnly && setRating(value)}
                    style={{
                        cursor: readOnly ? 'default' : 'pointer',
                        color: s <= rating ? '#ffb400' : '#ddd',
                        fontSize: size,
                        marginRight: 4,
                        userSelect: 'none'
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    );
}
