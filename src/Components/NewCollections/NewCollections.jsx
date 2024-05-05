import React from 'react'
import './NewCollections.css'
import Item from '../Item/Item'

const NewCollections = (props) => {
  return (
    <div className='new-collections'>
      <h1>Newly added products</h1>
      <div className="collections">
        {props.data.map((item,i)=>{
                return <Item id={item.id} key={i} name={item.name} image={item.image}  market_retail_price={item.market_retail_price} shoora_price={item.shoora_price} purchase_value={item.purchase_value} is_available={item.available}/>
            })}
      </div>
    </div>
  )
}

export default NewCollections
