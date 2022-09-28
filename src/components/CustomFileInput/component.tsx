import { useState, SyntheticEvent } from 'react';
import './style.css';

type JsonFileInputProps = {
  handleFileContent: (fileContent: string) => void;
  fileType?: string;
}

const CustomFileInput = ({ handleFileContent, fileType }: JsonFileInputProps) => {
  const [fileName, setFileName] = useState('');

  const handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const fileReader = new FileReader();

      setFileName(e.currentTarget.files[0].name);

      fileReader.readAsText(e.currentTarget.files[0]);
      fileReader.onload = e => {
        if (e.target && typeof e.target.result === 'string') {
          handleFileContent(e.target.result);
        }
      }
    }
  }

  const defaultLabelText = fileType ? `Choose a ${fileType} file` : 'Choose a file';
  const fileAccepts = fileType ? `.${fileType.toLocaleLowerCase()}` : '';

  return (
    <label className='custom-file-input'>
      <input type='file' accept={fileAccepts} onChange={handleChange} />
      <p>
        {fileName || defaultLabelText}
      </p>
    </label>
  );
}

export { CustomFileInput };