import React from 'react';


export default function Carousal() {
    return (
        <div>
            <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="https://assets.epicurious.com/photos/5c745a108918ee7ab68daf79/1%3A1/w_2560%2Cc_limit/Smashburger-recipe-120219.jpg" className="d-block w-100" alt="..." style={{ height: "400px", objectFit: "cover" }}  />
                    </div>
                    <div className="carousel-item">
                        <img src="https://www.thecuriouschickpea.com/wp-content/uploads/2018/12/Tibetan-Veggie-Momos-1.jpg" className="d-block w-100" alt="..." style={{ height: "400px", objectFit: "cover" }}  />
                    </div>
                    <div className="carousel-item">
                        <img src="https://www.cubesnjuliennes.com/wp-content/uploads/2020/08/Best-Indian-Punjabi-Samosa-Recipe.jpg" className="d-block w-100" alt="..." style={{ height: "400px", objectFit: "cover" }}  />
                    </div>
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    )
}
