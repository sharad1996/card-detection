import React from 'react'
import Styles from '../shared-styles/Styles'
import { Form, Field } from 'react-final-form'
import Card from '../shared-styles/Card';
import Payment from 'payment';
import '../App.css';

const sortValue = (value = '') => {
	return value.replace(/\D+/g, '');
}

const ccNumber = (val) => {
	if (val) {
		const finalVal = sortValue(val);
		let nextValue;
		if (Payment.fns.cardType(val) === 'amex') {
			nextValue = `${finalVal.slice(0, 4)} ${finalVal.slice(4, 10)} ${finalVal.slice(10, 15)}`
		} else if (Payment.fns.cardType(val) === 'dinersclub') {
			nextValue = `${finalVal.slice(0, 4)} ${finalVal.slice(4, 10)} ${finalVal.slice(10, 14)}`
		} else {
			nextValue = `${finalVal.slice(0, 4)} ${finalVal.slice(4, 8)} ${finalVal.slice(8, 12)} ${finalVal.slice(12, 16)}`
		}
		return nextValue.trim();
	}
}

const onSubmit = (values) => {
	console.log("These are the card values", values)
}

const cvvNumber = (val, prevValue, getObj = {}) => {
	let limit = 4;
	if (getObj.number) {
		limit = Payment.fns.cardType(getObj.number) === 'amex' ? 4 : 3
	}
	return sortValue(val).slice(0, limit);
}

const validThru = (val) => {
	const getValue = sortValue(val);
	if (getValue.length >= 3) {
		return `${getValue.slice(0, 2)}/${getValue.slice(2, 4)}`
	}
	return getValue;
}

export default function Dashboard() {

	return (
		<Styles>
			<Form onSubmit={onSubmit}
				render={({ handleSubmit, form, submitting, pristine, values, active }) => {
					return (
						<div>
							<form className="init-form" onSubmit={handleSubmit}>
								<div>
									<h3>Enter Card Details</h3>
								</div>
								<div className="card-details">
									<div className="data-entry">
										<div>
											<Field name="number" component="input" type="text" pattern="[\d| ]{12,16}"
												placeholder="Enter Card Number" format={ccNumber} />
										</div>
										<div>
											<Field name="name" component="input" type="text" placeholder="Enter Name" />
										</div>
										<div>
											<Field className="expiry" name="expiry" component="input" type="text" pattern="\d\d/\d\d"
												placeholder="Valid Thru" format={validThru} />
										</div>
										<div>
											<Field name="cvc" component="input" type="text" pattern="\d{3,4}"
												placeholder="CVC" format={cvvNumber} />
										</div>
										<div className="buttons">
											<button type="submit" disabled={submitting}> Submit </button>
										</div>
									</div>
									<div className="card-holder">
										<Card number={values.number || ''} name={values.name || ''} expiry={values.expiry || ''} cvc={values.cvc || ''} focused={active} />
									</div>
								</div>
							</form>
						</div>
					)
				}}
			/>
		</Styles>
	)
}
