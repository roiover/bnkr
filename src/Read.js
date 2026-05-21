// GalleryPage.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PinataSDK } from "pinata";

const PINATA_API_KEY = 'd89b13f00fa146e1aa418ab686628494';  // Replace with your Infura Project ID
const PINATA_SECRET_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI4ZWY3N2NlNC1lYjRkLTQ3NmQtYjc3ZC0yZjQwMWQwZTdhMmMiLCJlbWFpbCI6InNxYWltZXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjY1YmJiYmI3YzJjMjE1NGI3YzIwIiwic2NvcGVkS2V5U2VjcmV0IjoiZTdjZDA4ZTZkZGQyNGM4NzEyZTgwZmIzMjgzNDU4MjBlZTYxNWEwNTFlNjViMTViZTdlMTgwNDFmZTczMmM2YyIsImV4cCI6MTc2MjQ1NTExM30.PC3g9CarhHwxVynKXoqQwsqC9qZoEEKZdm2EY0L7HZk';  // Replace with your Infura Project Secret
const pinata = new PinataSDK({
  pinataJwt: PINATA_SECRET_API_KEY,
  pinataGateway: "https://chocolate-internal-scorpion-907.mypinata.cloud",
});
//bafkreifye7mrysnirozj3yvho3xrhtjrrl26jxn5f6lmpcjedsjm3k7gee
const ReadPage = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const jsonUrl = params.get('bunker');
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [descrx, setDescrx] = useState([]);
  const [Noticex, setNoticex] = useState([]);
  const [loadingx, setLoadingx] = useState(true); 
  const [filesDeleted, setFilesDeleted] = useState(false); // New state to hide all content if files are missing
  const [content, setContent] = useState([]); // New state to hide all content if files are missing

function extractAfterFiles(url) {
    return url.split('files/')[1];
}

   const deleteFiles = async (ids) => {
    try {
      console.log(ids);
      const deletedFiles = await pinata.files.delete(ids);
      console.log('Deleted files:', deletedFiles);
    } catch (error) {
      console.error('Error deleting files:', error);
    }
  };

const deleteFilesWithDelay = async (ids, delay) => {
  try {
    console.log(`Waiting ${delay}ms before deleting files...`);
    await new Promise((resolve) => setTimeout(resolve, delay)); // Wait for the specified delay
    const deletedFiles = await pinata.files.delete(ids);
    console.log("Deleted files:", deletedFiles);
  } catch (error) {
    console.error("Error deleting files:", error);
  }
};
	
 const handleImageError = (event) => {
  // Add a timeout to allow for delayed responses
  const img = event.target;
  
  setTimeout(() => {
    if (!img.complete || img.naturalWidth === 0) {
      console.error("Image failed to load:", img.src);
      setFilesDeleted(true);
    }
  }, 5000); // Wait 5 seconds before marking it as failed
};
  const checkImageExists = async (url) => {
    try {
      const response = await fetch(url, { method: "HEAD" });
      return response.ok; // Returns true if the image exists
    } catch (error) {
      console.error("Error checking image:", error);
      return false;
    }
  };
	 
 // Function to unpin file from Pinata

  
  useEffect(() => {
     const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    // Fetch the JSON data from the given IPFS URL
    const fetchData = async () => {
      try {
        //setLoadingx(true);
        console.log('start');
        console.log(jsonUrl)
      //  const { dataz, contentTypex } = await pinata.gateways.get(jsonUrl);
        console.log('xxxxx');
      //  console.log(dataz);
    

        //const datac = await pinata.gateways.get("bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq");
      const urlx = await pinata.gateways.createSignedURL({
  cid: jsonUrl,
  expires: 3000, // Number of seconds link is valid for
});

  console.log(urlx);
  console.log('bbbbb');

  const corsProxy = 'https://api.allorigins.win/get?url=';
  const proxiedUrl = `${corsProxy}${encodeURIComponent(urlx)}`;
  const proxyUrl = `https://photobunker.pro/proxy?url=${encodeURIComponent(urlx)}`;

 console.log(proxyUrl);
 
        const response = await fetch(proxyUrl);
        console.log(response);

        setContent(response);
        console.log('fff');
        //setImageUrls(data.images.map(image => image.url));
    
      } catch (error) {
        console.error('Error fetching gallery data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
       // setLoadingx(false);
      }
    };
//return () => clearTimeout(timer); // Cleanup timer
    fetchData();
    setLoadingx(false);
  }, [jsonUrl]);

if (filesDeleted) {
  // Show this notice and hide all other content if any image fails to load
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-red-800 text-white py-4 px-8 rounded-lg shadow-lg mb-6">
        Файлы были удалены и больше недоступны.
      </h1>
      <button
        onClick={() => (window.location.href = "/")}
        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
      >
        Вернуться на главную страницу
      </button>
    </div>
  );
}

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }
  // Loader component
  const Loader = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg shadow-lg">
        <span className="text-2xl font-semibold">PhotoBunker</span>
        <div className="flex space-x-1">
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "1.2s" }}></span>
          <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "1.4s" }}></span>
        </div>
      </div>
      <p className="mt-4 text-sm">Загрузка... Ожидайте</p>
    </div>
  );
  return (
      <>
      {loading ? (
        <Loader />
      ) : (
    <div className="min-h-screen bg-gray-900 text-white p-0">
    <header className="w-full flex md:justify-center justify-between items-center flex-col p-4 bg-gradient-to-r from-gray-700 to-gray-900 mb-1">
        <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-5 w-full ">
        <div className="flex flex-[0.5] justify-center items-center">
          {/* "PhotoBunker" as a button-like text */}
        <a href="/">
          <div className="flex items-center space-x-2 rounded-lg cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 shadow-lg hover:opacity-75">
            <span className="text-2xl font-semibold">PhotoBunker</span>
            {/* Upload Icon SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 40 20"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v6.586l3.707-3.707a1 1 0 111.414 1.414l-5 5a1 1 0 01-1.414 0l-5-5a1 1 0 111.414-1.414L9 10.586V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
              <path d="M10 13a7 7 0 100-14 7 7 0 000 14z" />
            </svg>
          </div></a>
        </div>
        </div>
      </header>
  {Noticex == 1 && (
 <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 text-center w-full max-w-screen flex items-center space-x-4">
      {/* SVG Icon */}
<svg
      fill="#ffffff"
      height="24px"
      width="24px"
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 611.999 611.999"
      xmlSpace="preserve"
      stroke="#ffffff"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <g>
          <path
            d="M570.107,500.254c-65.037-29.371-67.511-155.441-67.559-158.622v-84.578c0-81.402-49.742-151.399-120.427-181.203 C381.969,34,347.883,0,306.001,0c-41.883,0-75.968,34.002-76.121,75.849c-70.682,29.804-120.425,99.801-120.425,181.203v84.578 c-0.046,3.181-2.522,129.251-67.561,158.622c-7.409,3.347-11.481,11.412-9.768,19.36c1.711,7.949,8.74,13.626,16.871,13.626 h164.88c3.38,18.594,12.172,35.892,25.619,49.903c17.86,18.608,41.479,28.856,66.502,28.856 c25.025,0,48.644-10.248,66.502-28.856c13.449-14.012,22.241-31.311,25.619-49.903h164.88c8.131,0,15.159-5.676,16.872-13.626 C581.586,511.664,577.516,503.6,570.107,500.254z M484.434,439.859c6.837,20.728,16.518,41.544,30.246,58.866H97.32 c13.726-17.32,23.407-38.135,30.244-58.866H484.434z M306.001,34.515c18.945,0,34.963,12.73,39.975,30.082 c-12.912-2.678-26.282-4.09-39.975-4.09s-27.063,1.411-39.975,4.09C271.039,47.246,287.057,34.515,306.001,34.515z M143.97,341.736v-84.685c0-89.343,72.686-162.029,162.031-162.029s162.031,72.686,162.031,162.029v84.826 c0.023,2.596,0.427,29.879,7.303,63.465H136.663C143.543,371.724,143.949,344.393,143.97,341.736z M306.001,577.485 c-26.341,0-49.33-18.992-56.709-44.246h113.416C355.329,558.493,332.344,577.485,306.001,577.485z"
          ></path>
          <path
            d="M306.001,119.235c-74.25,0-134.657,60.405-134.657,134.654c0,9.531,7.727,17.258,17.258,17.258 c9.531,0,17.258-7.727,17.258-17.258c0-55.217,44.923-100.139,100.142-100.139c9.531,0,17.258-7.727,17.258-17.258 C323.259,126.96,315.532,119.235,306.001,119.235z"
          ></path>
        </g>
      </g>
    </svg>
      {/* Text Content */}
      <p className="flex-1 text-sm sm:text-base font-semibold">
        Файлы были удалены и больше не существуют. Повторный просмотр файлов невозможен.
      </p>
    </div>
 )}
      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
         <textarea
        value={content}
        readOnly
        className="w-full max-w-lg p-4 text-sm text-gray-100 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg shadow-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows="6"
      ></textarea>
      </div>
      {/* Example Text Section */}

   {/* Example Text Section */}
  
      {/* Advertising Section */}
      <section className="w-full p-8 bg-gradient-to-r from-indigo-700 to-purple-800 text-center rounded-lg mb-6 shadow-lg">
        <h2 className="text-3xl font-bold mb-4 text-white">ФОТО БУНКЕР</h2>
        <p className="text-lg text-gray-200 mb-6">
          Присоединяйтесь к нашему сервису и получайте доступ к безопасному и анонимному хранению изображений.
        </p>
        <button onClick={() => (window.location.href = '/')} className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
          Узнать больше
        </button>
      </section>
      {/* Footer */}
      <footer className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-center">
        <p className="text-sm">Powered by PhotoBunker | Secure & Anonymous Storage</p>
      </footer>
    </div>
   )}
    </>
  );
};
export default ReadPage;
