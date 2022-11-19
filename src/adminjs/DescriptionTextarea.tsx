import { BasePropertyComponentProps } from 'adminjs';
import React, { FC, useState } from 'react';

const DescriptionTextarea: FC<BasePropertyComponentProps> = (props) => {
    const { record, onChange } = props;
    const [description, setDescription] = useState<string>(record.params.description);

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let value = event.target.value;
        setDescription(value);
        onChange('description', value);
    }

    return (
        <>
            <label
                htmlFor='description'
                style={{
                    display: 'block',
                    fontFamily: 'Roboto',
                    fontSize: '12px',
                    lineHeight: '16px',
                    marginBottom: '8px',
                }}>
                Description
            </label>
            <textarea
                id='description'
                name='description'
                style={{
                    marginBottom: '16px',
                    width: '100%',
                    resize: 'vertical',
                }}
                value={description}
                onChange={handleChange}
            />
        </>
    )
}

export default DescriptionTextarea;