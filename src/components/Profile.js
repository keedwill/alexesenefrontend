import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import { useParams, useHistory } from 'react-router'
import axios from 'axios'

const Profile = () => {
  const [profile, setProfile] = useState([])
  const [updateForm, setUpdateForm] = useState(false)
  const { id } = useParams()
  const arrayProfile = []
  const history = useHistory()
  const [newLastName, setNewLastName] = useState('')
  const [newFirstName, setNewFirstName] = useState('')
  const [newJob, setNewJob] = useState('')
  const [newFile, setNewFile] = useState('')
  

  const token = JSON.parse(localStorage.getItem('token'))
  const tokenParts = token.split('.')
  const encodedPayload = tokenParts[1]
  const rawPayload = atob(encodedPayload)
  const tokenUser = JSON.parse(rawPayload)

  const getProfile = async () => {
    const response = await fetch(`https://alexeseneblog.onrender.com/users/${id}`, {
        headers: { Authorization: 'Bearer ' + token }
    });
    const profile = await response.json()
    arrayProfile.push(profile)
    setProfile(arrayProfile)
  }

  useEffect(() => {
    getProfile()
  }, [id])

  return (
    <>
      <NavBar />
      <section className='dashboard' id='profile'>
        <h1>My profile</h1>
        {profile.map((profil) => {
          const { id, lastName, firstName, imageUrl, job } = profil
          const textRegex =
            /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/i
          const deleteUser = async (e) => {
            e.preventDefault()
            if (
              window.confirm('Are you sure you want to delete your account ?')
            ) {
              axios({
                  method: 'DELETE',
                  url: `https://alexeseneblog.onrender.com/users/${id}`,
                  headers: { Authorization: 'Bearer ' + token }
              }).then(() => history.push('/login'));
            } else {
              return false
            }
          }

          const updateData = () => {
            setUpdateForm(true)
            setNewLastName(lastName)
            setNewFirstName(firstName)
            setNewJob(job)
            setNewFile(imageUrl)
          }

          const sendNewData = () => {
            if (
              textRegex.test(newLastName) &&
              textRegex.test(newFirstName) &&
              textRegex.test(newJob)
            ) {
              const formData = new FormData()
              formData.append('lastName', newLastName)
              formData.append('firstName', newFirstName)
              formData.append('job', newJob)
              formData.append('image', newFile)
              axios({
                  method: 'PUT',
                  url: `https://alexeseneblog.onrender.com/users/${id}`,
                  headers: {
                      'Content-Type': 'multipart/form-data',
                      Authorization: 'Bearer ' + token
                  },
                  data: formData
              })
                  .then(() => {
                      setUpdateForm(false);
                      window.location.reload();
                  })
                  .catch((error) => console.log(error));
            } else {
              alert('Please check your entries')
            }
          }

          return (
            <div className='profileContainer' key={id}>
              <div className='profileData'>
                <div>
                  <img src={imageUrl} alt='profile' />
                  {updateForm && (
                    <div>
                      <input
                        type='file'
                        id='newFile'
                        name='newFile'
                        accept='image/*'
                        onChange={(e) => setNewFile(e.target.files[0])}
                      />
                    </div>
                  )}
                </div>
                <div className='nameBox'>
                  <p>
                    {' '}
                   
Last name : {!updateForm && <span>{lastName}</span>}
                  </p>
                  {updateForm && (
                    <input
                      type='text'
                      id='newLastName'
                      name='newLastName'
                      value={newLastName}
                      onChange={(e) => setNewLastName(e.target.value)}
                    />
                  )}
                  <p> 
First name: {!updateForm && <span>{firstName}</span>}</p>
                  {updateForm && (
                    <div>
                      <input
                        type='text'
                        id='newFirstName'
                        name='newFirstName'
                        value={newFirstName}
                        onChange={(e) => setNewFirstName(e.target.value)}
                      />
                    </div>
                  )}
                  <p> 
Job: {!updateForm && <span>{job}</span>}</p>
                  {updateForm && (
                    <div>
                      <input
                        type='text'
                        id='newJob'
                        name='newJob'
                        value={newJob}
                        onChange={(e) => setNewJob(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
              {(id === tokenUser.userId || tokenUser.isAdmin) && (
                <div>
                  {updateForm ? (
                    <button className='btn' onClick={sendNewData}>
                      Send my new data
                    </button>
                  ) : (
                    <button className='btn' onClick={updateData}>
                     Modify my data
                    </button>
                  )}

                  <button className='btn' onClick={deleteUser}>
                  Delete my account
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </section>
    </>
  )
}

export default Profile
