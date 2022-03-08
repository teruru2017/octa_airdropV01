import React, { useState, useEffect } from "react";
const App = () => { 
    const [error, setErrors] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [airdrop, setAirdrop] = useState({})
    useEffect(() => {
      fetch("http://localhost:3333/airdrop/")
        .then((res) => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setAirdrop(result);
            console.log(result);
          },
          (error) => {
            setAirdrop(true);
            setErrors(error);
          }
        );
    }, []);
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
    return(<tbody>
       {airdrop.map((airdrop) => (
      <h5>
       {airdrop.accout}
      </h5>
      ))}
      
      </tbody>
    }
  }
  
//       <table>
//         <thead>
//           <tr>
//             <th scope="col">#</th>
//             <th scope="col">Name</th>
//             <th scope="col">Username</th>
//             <th scope="col">Avatar</th>
//           </tr>
//         </thead>
//         <tbody>
//           {airdrop.map((airdrop) => (
//             <tr key={airdrop.id}>
//               <th scope="row">{airdrop.id}</th>
//               <td>
//                 {airdrop.accout} {airdrop.boxid}
//               </td>
//               <td>{airdrop.boxtype}</td>
//               <td>
//                 <img
//                   src={airdrop.img}
//                   alt="avatar"
//                   style={{ width: "30px" }}
//                 />
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   }
// }



    // return <div className="container">
    //    <h2>Airdrop</h2>
      
    //     <span>{JSON.stringify(airdrop)}</ span>
    //     <hr />
    //     <span>Has error : {JSON.stringify(hasError)}</span>
       
    // </div>
export default App;