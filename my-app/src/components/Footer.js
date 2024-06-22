import React from "react";
import "../assets/css/Footer.css";

export class Footer extends React.Component{
    render(){
        return (
            <footer className="page-footer">
                <div className="container center">
                    © {new Date().getFullYear() } Copyright
                </div>
          </footer>
        )
    }
}