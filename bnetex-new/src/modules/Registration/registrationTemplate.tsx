import Blur from "components/blurredBackgroundItem";
import React, { FC, useState } from "react";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";

interface RegistrationTemplateProps {
    children : React.ReactNode
}

const RegistrationTemplate: FC<RegistrationTemplateProps> = (props) => {

    const [step, setStep] = useState(1);

    return (
        <div>
            <div
                className="background-blur"
            >
                <Blur 
                    color={'purple'}
                    top={'0'}
                    left={'0'} 
                    type={'ellipse'}
                    rotate={-165}
                />
                <Blur 
                    color={'blue'}
                    top={'-10%'}
                    left={'30%'} 
                    type={'ellipse'}
                />
                <Blur 
                    color={'green'}
                    top={'-30%'}
                    left={'-10%'} 
                    type={'circle'}
                />        
            </div>
            {props.children}
        </div>
    )
}

export default RegistrationTemplate;