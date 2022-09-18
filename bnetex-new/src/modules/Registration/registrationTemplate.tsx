import Blur from "components/blurredBackgroundItem";
import React, { FC, useState } from "react";
import StepOne from "./stepOne";
import StepTwo from "./stepTwo";

import styles from './registration.module.scss';


interface RegistrationTemplateProps {
    children : React.ReactNode
}

const RegistrationTemplate: FC<RegistrationTemplateProps> = (props) => {

    const [step, setStep] = useState(1);

    return (
        <div
            className={styles['page-wrapper']}
        >
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
            <div
                className={styles['content-container']}
            >
                {props.children}
            </div>
        </div>
    )
}

export default RegistrationTemplate;