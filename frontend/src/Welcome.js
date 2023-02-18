import React, { useEffect, useState } from 'react';
import SimpleStorage from './contracts/SimpleStorage.json';
import { dev } from './env';

const initiaState = { name: '', number: '' };

function Welcome(props) {

  const [account, setAccount] = useState(null);
  const [form, setForm] = useState(initiaState);
  const [people, setPeople] = useState('');
  const [favNumber, setFavNumber] = useState();
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    (async () => {
      if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this dApp!');
      } else {
        await enableEthereum();
      }

    })();

  });

  const enableEthereum = async () => {
    window.web3 = new window.Web3(window.ethereum);
    const currentChainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    if (currentChainId !== window.web3.utils.toHex(dev.ChainId)) {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: window.web3.utils.toHex(dev.ChainId) }],
      })
    }
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.debug('Wallet accounts: ', accounts);
    setAccount(window.web3.utils.toChecksumAddress(accounts[0]));
  };

  const getContract = () => {
    return new window.web3.eth.Contract(SimpleStorage, dev.SimpleStorage);
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const addDetail = async () => {
    const contract = getContract();
    setIsLoading(true);
    const tx = await contract.methods.addPerson(form.name, form.number).send({ from: account });
    setForm(initiaState);
    setIsLoading(false);

    console.log(tx);
  }

  const searchNumber = async () => {
    const contract = getContract();
    const _people = await contract.methods.nameToFavoriteNumber(people).call();
    if (_people) {
      setFavNumber(_people)
    }
  }

  return (
    <>
      <section className='section'>

        <div className='form'>
          <h2>My Best Friends List - DAPP for ({account})</h2>
          <div className='input-label'>
            <label htmlFor='name'>Enter your friends name </label>
            <input type="text" id='name' className='input-field' name="name" onChange={(e) => handleInput(e)} value={form.name} />
          </div>
          <div className='input-label'>
            <label htmlFor='number'>Enter the Lucky Number </label>
            <input type="text" id='number' className='input-field' name="number" onChange={(e) => handleInput(e)} value={form.number} />
          </div>
          <div >
            <input type="button" className='btn' onClick={addDetail} value="Add in list" />
          </div>
          <div className='input-label'>
            <label>Enter the Lucky Number </label>
            <input type="text" className='input-field' name="number" onChange={(e) => setPeople(e.target.value)} value={people} />
          </div>
          <div className='input-btn'>
            <input type="button" className='btn' onClick={searchNumber} value="Tell me Lucky Number" />
            <h5>
              {(favNumber) ? `Luck Number : ${favNumber}` : ''}
            </h5>
          </div>
        </div>

        {isLoading && <div className='loader'>

          <h3>Loading...</h3>
        </div>

        }
      </section>

    </>
  );
}

export default Welcome;
