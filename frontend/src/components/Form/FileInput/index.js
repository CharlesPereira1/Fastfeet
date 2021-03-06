import React, { useRef, useEffect, useState } from 'react';
import { IoIosImages } from 'react-icons/io';

import { useField } from '@unform/core';
import PropTypes from 'prop-types';

import {
  Container,
  Preview,
  PreviewDefault,
  PreviewDefaultError,
  PreviewText,
  ContentPreview,
} from './styles';

export default function InputFile({ name, label, schema, initial, ...rest }) {
  const inputRef = useRef(null);

  const { fieldName, registerField, defaultValue, error } = useField(name);

  const [preview, setPreview] = useState(initial);

  async function handlePreview(e) {
    const file = e.target.files[0];
    if (!file) {
      setPreview(null);
    }
    const previewURL = URL.createObjectURL(file);

    setPreview(previewURL);
  }
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'files[0]',
      clearValue(ref) {
        ref.value = '';
        setPreview(null);
      },
      setValue(_, value) {
        setPreview(value);
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container>
      <label htmlFor={name}>
        <ContentPreview>
          {preview ? (
            <Preview>
              <img src={preview} alt="Preview" />
            </Preview>
          ) : (
            <PreviewDefault>
              <IoIosImages size={50} color="#DDD" />
              <PreviewText>Adicionar foto</PreviewText>
            </PreviewDefault>
          )}
        </ContentPreview>
      </label>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        id={name}
        onChange={handlePreview}
        {...rest}
      />
      {/* {error && <span className="error">{error}</span>} */}
    </Container>
  );
}

InputFile.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  schema: PropTypes.object,
  initial: PropTypes.string,
};

InputFile.defaultProps = {
  label: null,
  schema: {},
  initial: null,
};
