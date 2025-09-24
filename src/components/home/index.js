
import { useEffect, useState } from "react";
import "./index.css";
import Modal from "react-modal"


// Required: bind modal to your app element for accessibility
Modal.setAppElement("#root");


function Home(){
    const[userData,setUserData]=useState([]);
    const[isModalOpen,setIsModalOpen]=useState(false);
    const[isSelectedUser,setSelectedUser]=useState(null);
    const[isAddModal,setIsAddModal]=useState(false);
    const[newUser,setNewUser]=useState({name:"",email:"",company:{name:""}});
    const[search,setSearch]=useState("");
    const[currentPage,setCurrentPage]=useState(1);
    const usersPerpage=5;
    const lastIndexUser=currentPage*usersPerpage;
    const firstIndexUser=lastIndexUser-usersPerpage;
 

    

    useEffect(
        ()=>{
            const fetching=async()=>{
            const api="https://jsonplaceholder.typicode.com/users"
            try{
            const fetchingData=await fetch(api);
            console.log(fetchingData);
            if(fetchingData.ok){
                const response=await fetchingData.json();
                setUserData(response);
            }
        }
        catch(err){
            console.log("error while fetching",err.message);
            alert("please try again error encountered while fetching");
        }

            }
            fetching();
        },[]
    )


    // opening the modal on selected user 
    const EditUser=async(id)=>{
       // const editapi="https://jsonplaceholder.typicode.com/users";
        const userFind=userData.find((each)=>each.id===id);
        setSelectedUser(userFind)
        setIsModalOpen(true);
    }

    //close the modal setuser to null 
    const isModalClose=()=>{
        setSelectedUser(null);
        setIsModalOpen(false);
    }

    //handle change we store each user data edit 
    const handleChange=(e)=>{
        const {name,value}=e.target; // destructuring 
        setSelectedUser({...isSelectedUser,
            [name]:value
        })

    }

    //save the user info 

    const submitUserData=async(e)=>{
        e.preventDefault();
        const saveUserInfo=userData.map((each)=>(
            each.id===isSelectedUser.id?isSelectedUser:each
        ));
        //update 
        setUserData(saveUserInfo);
        
        try{
            const api=`https://jsonplaceholder.typicode.com/users/${isSelectedUser.id}`;
            const options={
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(isSelectedUser)
            }
            const fetching=await fetch(api,options);
            console.log("fetch",fetching)
            if(fetching.ok){
                console.log("success");
            }
            else{
                console.log("err");
            }

        }catch(err){
            console.log("err",err.message);

        }



        isModalClose();

    }

    // delete the user
    const DeleteUser=async(id)=>{
        console.log(id);
        const confirmDelete=window.confirm("Are you sure you want  to delete user?");
        if(confirmDelete){
        const filtering=userData.filter((each)=>each.id!==id);
        setUserData(filtering);
        }


        
        try{
            const api=`https://jsonplaceholder.typicode.com/users/${id}`;
            const options={
                method:"DELETE"
            }
            const fetching=await fetch(api,options);
            console.log("fetch",fetching)
            if(fetching.ok){
                console.log("success");
            }
            else{
                console.log("err");
            }

        }catch(err){
            console.log("err",err.message);

        }

    }


    // creating new user 
    const handleNewUser=async(e)=>{
        const{name,value}=e.target; // destructuring  
        if(name==="company"){
            setNewUser({...newUser,company:{...newUser.company,name:value}})
        }
        else{
            setNewUser({...newUser,[name]:value})
        }

        try{
            const api="https://jsonplaceholder.typicode.com/users";
            const options={
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(newUser)
            }
            const fetching=await fetch(api,options);
            console.log("fetch",fetching)
            if(fetching.ok){
                console.log("success");
            }
            else{
                console.log("err");
            }

        }catch(err){
            console.log("err",err.message);

        }

    }

    //close the new add modal 
    const isAddModalClose=()=>{
        setIsAddModal(false);
    }

    // open is add modal 
    const isAddModalOpen=()=>{
        setIsAddModal(true);
    }

    // adding new user data 
    const addUser=()=>{
        const idCreate=userData.length?Math.max(...userData.map((each)=>each.id))+1:1;
        setUserData([...userData,{...newUser,id:idCreate}])
        isAddModalClose();
    }

   const lowerSearch=search.toLowerCase(); 
    const filteredUsers=
 userData.filter((each)=>each.name.toLowerCase().includes(lowerSearch) ||
    each.email.toLowerCase().includes(lowerSearch) ||each.company.name.toLowerCase().includes(lowerSearch) )
 ;

   const currentUsers=filteredUsers.slice(firstIndexUser,lastIndexUser);




    return (
        <div>
            <h1>Welcome to User Dashboard Management</h1>

            
            <input className="search-user-input" onChange={(e)=>{setSearch(e.target.value);setCurrentPage(1)}} type="search" placeholder="Search a user" value={search}/>
            <br/>
            <br/>

        <button className="add-new-user-button" onClick={isAddModalOpen} type="button">Add User</button>

            {/* adding new user modal */}
            <Modal
            isOpen={isAddModal}
            onRequestClose={isAddModalClose}
            contentLabel="User Adding"
            style={{
                 content: {
                    top: "50%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    transform: "translate(-50%, -50%)",
                    padding: "20px",
                    borderRadius: "8px",
                    minWidth: "300px",
                    },
            }}
            >
                <form onSubmit={addUser}>
                    <label>
                        Name:
                        <input type="text" name="name" value={newUser.name} onChange={handleNewUser}/>
                    </label>
                    <br/>
                    <label>
                        Email:
                        <input type="text" name="email" value={newUser.email} onChange={handleNewUser}/>
                    </label>
                    <br/>
                    <label>
                        Company:
                        <input type="text" name="company" value={newUser.company?newUser.company.name:""}
                        onChange={handleNewUser}/>
                    </label>
                    <br/>
                    <button className="cancel-button" type="button" onClick={isAddModalClose}>Cancel</button>
                    <br/>
                    <button className="save-button" type="submit">Save</button>
                </form>

            </Modal>

            {/* showing user data and edit*/}
           { currentUsers.length===0?<p className="user-not-found">No Users Found</p>:
            <div className="card-bg">
            <div className="user-data">
            {currentUsers.map((each)=>(
                <div className="each-user" key={each.id}>
                    <p>Id: {each.id}</p>
                    <p>Name: {each.name}</p>
                    <p>Email: {each.email}</p>
                    <p>Company: {each.company.name}</p>
                    <button className="edit-button" onClick={()=>EditUser(each.id)}>Edit</button>
                    <button className="delete-button" onClick={()=>DeleteUser(each.id)}>Delete</button>
                </div>
            ))}


            {/*Modal for edit */}

            <Modal isOpen={isModalOpen}
            onRequestClose={isModalClose}
            contentLabel="Edit User"
            style={{
                  content: {
                    top: "50%",
                    left: "50%",
                    right: "auto",
                    bottom: "auto",
                    transform: "translate(-50%, -50%)",
                    padding: "20px",
                    borderRadius: "8px",
                    minWidth: "300px",
                },
            }}
            >   

            {
                isSelectedUser&&
                <form onSubmit={submitUserData}>
                    <label>
                        Name:
                        <input name="name" onChange={handleChange} type="text" value={isSelectedUser.name}/>
                    </label>
                    <br/>
                    <label>
                        Email:
                        <input name="email" onChange={handleChange} type="text" value={isSelectedUser.email}/>
                    </label>
                    <br/>
                    <label>
                        Department:
                        <input onChange={(e)=>setSelectedUser({...isSelectedUser,company:{...isSelectedUser.company,name: e.target.value},}) }
                        value={isSelectedUser?isSelectedUser.company.name:""} />
                    </label>
                    <br/>

                       <button className="cancel-button" onClick={isModalClose}  type="button">Cancel</button>
                       <br/>
                       <button className="save-button" type="submit">Save</button>

                </form>
            }



             







            </Modal>



            </div>
            </div>

            }


            <div>
                <button className="prev-button" disabled={currentPage===1} type="button" onClick={()=>setCurrentPage(currentPage-1)}>Prev</button>
                <span className="page-info">
                {currentPage} 
               {currentPage===Math.ceil(filteredUsers.length/usersPerpage)?"":<span>{" - "} {Math.ceil(filteredUsers.length/usersPerpage)} </span>  }
                </span>


                <button className="next-button" disabled={currentPage===Math.ceil(filteredUsers.length/usersPerpage)}
                 onClick={()=>setCurrentPage(currentPage+1)}>Next</button>
            </div>
        
        
        </div>
    )
}

export default Home;