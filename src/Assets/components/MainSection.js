import React, {Component, Fragment} from 'react';
import {Col, Container, Row} from "react-bootstrap";
import {FaCamera,FaFolder, FaChartBar} from 'react-icons/fa';
import * as faceapi from "face-api.js";


import damoImage from '../img/image-solid.png';
import Webcam from "react-webcam";
import SweetAlert from "react-bootstrap-sweetalert";
import ReactJson from "react-json-view";
import Loader from "./Loader";


class MainSection extends Component {
    constructor() {
        super();
        this.webcamRef=React.createRef();
        this.state={
            damoImg:damoImage,
            CameraError:false,
            loaderDIV:"d-none",
            mainDiv:"",
            //ageAndGender:[],
            expression:[],
            myExpression:"....",
            age:"....",
            gender:"....",
        }
    }
    onCapute=()=>{
        let imageString = this.webcamRef.current.getScreenshot();
        this.setState({damoImg:imageString})
    }
    onSave=()=>{
        let imgSrc = this.state.damoImg;
        let a = document.createElement('a');
        a.href = imgSrc;
        a.download = 'myImg.jpeg';
        a.click();
    }
    CameraErrorAlert=()=>{
        if(this.state.CameraError===true){
            return(
                <SweetAlert danger title="Device Camera Not Working" onConfirm={this.onCameraTryAgain}>
                </SweetAlert>
            )
        }
    }

    onCameraTryAgain=()=>{
        window.location.href="/";
    }
    onCameraError=()=>{
        this.setState({CameraError:true})
    }
    onAnalysis=()=>{
        (async ()=>{
            this.setState({loaderDIV:""});
            await faceapi.nets.ssdMobilenetv1.loadFromUri('models/');
            await faceapi.nets.ageGenderNet.loadFromUri('models/');
            await faceapi.nets.faceExpressionNet.loadFromUri('models/');
            let imageId = document.getElementById('imageId');
            let myImage = await faceapi.detectAllFaces(imageId).withAgeAndGender().withFaceExpressions();
            this.setState({expression:myImage});
            let age = parseInt(myImage[0]['age']);
            let gender = myImage[0]['gender'];
            this.setState({age:age, gender:gender});

            // Expresssion
            let neutral= (myImage[0]['expressions']['neutral'])
            let happy= (myImage[0]['expressions']['happy'])
            let sad=  (myImage[0]['expressions']['sad'])
            let angry=  (myImage[0]['expressions']['angry'])
            let fearful=   (myImage[0]['expressions']['fearful'])
            let disgusted=  (myImage[0]['expressions']['disgusted'])
            let surprised=   (myImage[0]['expressions']['surprised'])

            if(neutral>0.9 && neutral<1.2 ){
                this.setState({myExpression:"Natural"})
            }
            else if(happy>0.9 && happy<1.2 ){
                this.setState({myExpression:"Happy"})
            }
            else if(sad>0.9 && sad<1.2 ){
                this.setState({myExpression:"Sad"})
            }
            else if(angry>0.9 && angry<1.2 ){
                this.setState({myExpression:"Angry"})
            }
            else if(fearful>0.9 && fearful<1.2 ){
                this.setState({myExpression:"Fearful"})
            }
            else if(disgusted>0.9 && disgusted<1.2 ){
                this.setState({expression:"Disgusted"})
            }
            else if(surprised>0.9 && surprised<1.2 ){
                this.setState({myExpression:"Durprised"})
            }



            this.setState({loaderDIV:"d-none"})

        })()
    }
    render() {
        return (
            <Fragment>
                <div className="mainDiv">
                    <Container>
                        <Row className="main-section p-3">
                            <Col md={4} lg={4} className="camera-section text-center">
                                <Webcam
                                    onUserMediaError={this.onCameraError}
                                    audio={false}
                                    ref={this.webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className="w-100 p-2 border h-75"
                                />
                                <button className="btn btn-success my-2" onClick={this.onCapute}><FaCamera></FaCamera><span className="px-2">Capture</span></button>
                            </Col>
                            <Col md={4} lg={4} className="image-section text-center">
                                <img id="imageId" src={this.state.damoImg} className="w-100 p-2 border" alt=""/>
                                <button className="btn btn-success my-2" onClick={this.onSave}><FaFolder></FaFolder><span className="px-2">Save</span></button>
                            </Col>
                            <Col md={4} lg={4} className="result-section">
                                <div className="w-100 p-2 border h-75">
                                    <h4>Age: <span className="text-success">{this.state.age}</span></h4>
                                    <h4>Gender: <span className="text-success text-capitalize">{this.state.gender}</span></h4>
                                    <h4>Expression: <span className="text-success">{this.state.myExpression}</span></h4>
                                </div>
                                <div className="text-center">
                                    <button className="btn btn-success my-2" onClick={this.onAnalysis}><FaChartBar></FaChartBar><span className="px-2">Analysis</span></button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                {this.CameraErrorAlert()}
                <div className={this.state.loaderDIV}>
                    <Loader></Loader>
                </div>
            </Fragment>
        );
    }
}

export default MainSection;