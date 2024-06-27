// components/ItemList.js
import React from 'react';

const ItemList = ({ items, onDeleteItem }) => {
    return (
        <div className="item-list">
            <h2>Item List</h2>
            {items.map((item, index) => (
                <div className="flex flex-row " key={index}>
                    <div>
                        <strong>name</strong>: {item.product}
                    </div>
                    <div>
                    <strong>description:</strong> {item.description}
                    </div>
                    <div>
                        <strong>Quantity:</strong> {item.quantity}
                    </div>
                    <div><strong>Gross Amout:</strong> rs {item.grossAmout}</div>
                    <div><strong>discount:</strong> rs {item.discount}</div>
                    <div><strong>gst:</strong> 18%</div>

                    <button onClick={
                        () =>
                            onDeleteItem(index)}>
                        Delete
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ItemList;
