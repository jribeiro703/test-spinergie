import jp from 'jsonpath';
import { CustomFileInput } from 'components/CustomFileInput';
import './style.css';
import { useState } from 'react';

function App() {
  const [parsedJson, setParsedJson] = useState({});
  const [modificationFileLines, setModificationFileLines] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [resultJson, setResultJson] = useState('');

  const handleJsonString = (fileContent: string) => {
    try {
      setParsedJson(JSON.parse(fileContent));
      setErrors([]);
    } catch {
      setErrors(['Configuration file is not a valid JSON']);
    }
  };

  const handleModificationFileContent = (fileContent: string) => {
    setModificationFileLines(fileContent.split(/\r?\n/));
  }

  const handleClick = () => {
    let json = JSON.parse(JSON.stringify(parsedJson));

    modificationFileLines.forEach((line, i) => {
      let lineNumber = i + 1;

      try {
        let elements = line.split(':').map(elem => elem.trim());

        if (elements.length !== 2) {
          throw new Error(`Bad formatting`);
        }

        let jsonPath = elements[0].trim().slice(1, elements[0].length - 1);
        let jsonValue = elements[1].trim();

        jp.value(json, `$.${jsonPath}`, jsonValue);
      } catch(e: any) {
        if (e.message) {
          setErrors([...errors, `Line ${lineNumber} : ${e.message}`]);
        }
      }
    });

    console.log(json);

    setResultJson(JSON.stringify(json));
  }

  const isButtonDisabled = errors.length > 0
    || Object.keys(parsedJson).length === 0
    || modificationFileLines.length === 0;

  return (
    <>
      <section className='inputs-container'>
        <div className='input-file'>
          <h2>Configuration file</h2>
          <CustomFileInput handleFileContent={handleJsonString} fileType='json' />
        </div>

        <div className='input-file'>
          <h2>Modification file</h2>
          <CustomFileInput handleFileContent={handleModificationFileContent} />
        </div>

        <button type='button' disabled={isButtonDisabled ? true : false} onClick={handleClick}>
          <p>Generate Json</p>
        </button>
      </section>

      {errors.length > 0 &&
        <section className='errors-container'>
          <ul>
            {errors.map((error, i) => <li key={i}>{error}</li>)}
          </ul>
        </section>
      }

      {errors.length === 0 && resultJson.length > 0 &&
        <section className='result-container'>
          <h2>Result Json :</h2>
          <pre>
            {resultJson}
          </pre>
        </section>
      }
    </>
  );
}

export { App };
