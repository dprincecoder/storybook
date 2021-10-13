import { CKEditor } from 'ckeditor4-react';
import React, { useState } from 'react'
import AuthWrapper from '../authwrapper/Authwraper';
import InputForm from '../forms/inputs/InputForm'
import Button from '../forms/button/Button'

const AddStory = () => {
		const [title, setTitle] = useState("");
		const [category, setCategory] = useState("");
		const [firstName, setFirstName] = useState("");
		const [storyDetails, setStoryDetails] = useState("");


    const configAuthWrapper = {
        headline: "Share you story"
    }
    return (
			<div className="container">
				<div className="card-content">
					<AuthWrapper custom="row" {...configAuthWrapper}>
						<form>
							Title:
							<InputForm
								type="text"
								name="title"
								placeholder="Enter your story Title"
								value={title}
								required
								handleChange={(e) => setTitle(e.target.value)}
							/>
							Category:
							<InputForm
								type="text"
								name="category"
								placeholder="E.g marriage, family, relationship or vacation"
								value={category}
								required
								handleChange={(e) => setCategory(e.target.value)}
							/>
							First Name:
							<InputForm
								type="text"
								name="firstName"
								placeholder="Enter your first name"
								value={firstName}
								required
								handleChange={(e) => setFirstName(e.target.value)}
							/>
							Share your story in details:
							<CKEditor
								onChange={(evt) => setStoryDetails(evt.editor.getData())}
                        />
                        <div className="divider"></div>
                        <br />
                        <Button>Publish</Button>
						</form>
					</AuthWrapper>
				</div>
			</div>
		);
}

export default AddStory
