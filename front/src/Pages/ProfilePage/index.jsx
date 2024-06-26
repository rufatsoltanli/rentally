import React, { useContext, useEffect, useState } from 'react'
import "./style.scss"
import { JWTContext } from '../../Context/JwtContext'
import { WishlistContext } from '../../Context/WishlistContext';
import Button from '../../Components/CommonComponents/button';
import { Link, useNavigate } from 'react-router-dom';


function ProfilePage() {
  const { token, addToken, decodedToken, logOut, checkToken } = useContext(JWTContext)

  console.log(decodedToken);

  const [booking, setBooking] = useState([])

  const [userData, setUserData] = useState([])

  const logOutNavigate = useNavigate()

  useEffect(() => {

    fetch("http://localhost:3000/users/" + decodedToken.id, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUserData(data))
      .catch(error => console.log(error.message))


  }, [])

  useEffect(() => {
    fetch("http://localhost:3000/users/getBookings/" + decodedToken.id, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `${token}`
      }
    })
      .then(res => res.json())
      .then(data => setBooking(data))
      .catch(error => console.log(error.message))


  }, [])
  console.log(booking);


  const { wishlist } = useContext(WishlistContext)

  return (
    <div className='profilePage'>
      <div className="pageCont">
        <div className="profileCard">

          <div className="name"><span>Username</span>{decodedToken && decodedToken.username}</div>
          <div className="email"><span>E-mail</span>{decodedToken && decodedToken.email}</div>
          <div className="signOut" onClick={() => { 
            logOutNavigate('/')
            logOut() }}>
            Sign out
          </div>
        </div>
        <div className="profileInfo">
          <div className="ordersCont">
            <div className="card">
              <div className="icon">
                <i className='fa-solid fa-calendar-days'></i>
              </div>
              <div className="orders">
                <div className="number">
                  {
                    userData.bookings ? userData.bookings.length : null
                  }
                </div>
                <div className="text">Total Orders</div>
              </div>
            </div>
            <div className="card">
              <div className="icon">
                <i className='fa-regular fa-clock'></i>
              </div>
              <div className="orders">
                <div className="number">
                  {booking.bookings && booking.bookings.filter((x) => x.status === "Waiting").length}
                </div>
                <div className="text">Waiting</div>
              </div>
            </div>
            <div className="card">
              <div className="icon">
                <i className='fa-solid fa-check'></i>
              </div>
              <div className="orders">
                <div className="number">
                  {booking.bookings && booking.bookings.filter((x) => x.status === "Completed").length}
                </div>
                <div className="text">Completed orders</div>
              </div>
            </div>
            <div className="card">
              <div className="icon">
                <i className='fa-regular fa-calendar-xmark'></i>
              </div>
              <div className="orders">
                <div className="number">
                  {booking.bookings && booking.bookings.filter((x) => x.status === "Canceled").length}
                </div>
                <div className="text">Canceled orders</div>
              </div>
            </div>
          </div>
          <div className="recentOrdersCont">
            <h3>My Recent Orders</h3>
            <table>
              <tr>
                <th>Car Name</th>
                <th className='pickUpLoc'>Pick-up Location</th>
                <th className='dropOffLoc'>Drop-off Location</th>
                <th className='days'>Days</th>
                <th>Status</th>
              </tr>
              {booking.bookings && booking.bookings.map((x) => (
                <tr key={x._id} className='tableCar'>
                  <td className='tableCarName'>{x.chosenCarName}</td>
                  <td className='pickUpLoc'>{x.pickUpLocation}</td>
                  <td className='dropOffLoc'>{x.dropOffLocation}</td>
                  <td className='days'>{x.day}</td>
                  <td><span
                    className={
                      x.status === "Waiting" ? "waiting" :
                        x.status === "Completed" ? "completed" :
                          x.status === "Canceled" ? "canceled" : null
                    }>{x.status}</span></td>
                </tr>
              ))}
            </table>
          </div>
          <div className="favoriteCars">
            <h3>
              My favorite cars
            </h3>
            <div className="carCont">
              {wishlist && wishlist.map((x) => (
                <div className="car">
                  <div className="img"><img src={x.image[0]} alt="" /></div>
                  <div className="text">
                    <div className="name"><span>{x.name}</span></div>
                    <div className="detailedInfo">
                      <div className="year"><span>Year:</span>{x.year}</div>
                      <div className="fuel"><span>Fuel:</span>{x.fuel}</div>
                      <div className="body"><span>Body:</span>{x.type}</div>
                      <div className="color"><span>Color:</span>{x.color}</div>
                      <div className="interior"><span>Interior color:</span>{x.interiorColor}</div>
                      <div className="city"><span>Baku:</span>Baku</div>
                    </div>
                    <div className="price">
                      <div className="dailyRate">
                        <span className='daily'>Daily rate from</span>
                        <span className='price'>${x.price}</span>
                      </div>
                      <div className="button" >

                        <Link to={'/detailPage/' + x._id}>
                          <Button>
                            Rent Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div >)


}

export default ProfilePage