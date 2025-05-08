import React from 'react';
import '../admincss/Categories.css';

const Categories = ({ categories }) => {
  return (
    <div className="categories">
      <h2>Categories</h2>
      {Object.entries(categories).map(([category, docs]) => (
        <div key={category} className="category-section">
          <h3>{category.toUpperCase()}</h3>
          {docs.length === 0 ? (
            <p>No documents in this category.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Owner Name</th>
                  <th>Document</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, index) => (
                  <tr key={index}>
                    <td>{doc.owner}</td>
                    <td>{doc.fieldOfStudy} ({doc.year})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
};

export default Categories;