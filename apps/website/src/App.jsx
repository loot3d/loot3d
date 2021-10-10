import cx from 'classnames';

import './App.scss';
import Loader from './Loader';
import { useApp } from './useApp';

const CONTRACT_ADDRESS = '0x2a0af8a5980a36b31fbe4f7ad4c05d6854a0daf2';

function App() {
  const [canvasRef, loading, bagNumber, setBagNumber, handleRandom, bagAsset] = useApp();

  return (
    <div className="app">
      <div className="header">
        <h3 className="header-name">Loot 3D Characters</h3>
        <p className="header-desc">Loot 3D is the first collection of 3D character for loot metaverse.</p>
        <ul className="links">
          <li className="link">
            <a href="https://opensea.io/collection/loot3d" target="_blank" rel="noopener noreferrer">OpenSea</a>
          </li>
          <li className="link">
            <a href="https://twitter.com/loot3dmoon" target="_blank" rel="noopener noreferrer">Twitter</a>
          </li>
          <li className="link">
            <a href={`https://etherscan.io/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer">Contract</a>
          </li>
        </ul>
      </div>

      <div className="main">
        <div className={cx('viewport space', {loading})}>
          <canvas
            className="canvas round"
            ref={canvasRef}
          />
          <Loader />
        </div>

        <div className="content">
          {!!bagAsset && (
            <>
              <div className="panel space round">
                <form
                  className="form space"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <input
                    className="input bagInput"
                    type="number"
                    name="bagNumber"
                    value={bagNumber}
                    onBlur={evt => setBagNumber(Math.min(Math.max(~~evt.target.value, 1), 8000))}
                    disabled={loading}
                  />
                  <button
                    className="btn bagBtn"
                    onClick={handleRandom}
                  >
                    random
                  </button>
                </form>
                  
                <ul className="properties">
                  {Object.keys(bagAsset).map(key => (
                    <li
                      key={key}
                      className="property"
                    >
                      <div className="propertyInner">
                        <span className="propertyLabel">{key}</span>
                        <span className="propertyValue">{bagAsset[key]}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <a
                className="btn big block round"
                href={`https://opensea.io/assets/${CONTRACT_ADDRESS}/${bagNumber}`}
              >
                OpenSea #{bagNumber}
              </a>
            </>
          )}
        </div>
      </div>

      <div className="footer">
        <p className="footer-desc">This website is <a href="https://github.com/sanonz/loot3d" target="_blank" rel="noreferrer">open-source</a>.</p>
      </div>
    </div>
  );
}

export default App;
