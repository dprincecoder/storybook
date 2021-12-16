import React from "react";
import { useSelector } from "react-redux";
const mapState = ({ user }) => ({
	userData: user.userData,
});
const Welcome = () => {
	const { userData } = useSelector(mapState);
	const { displayName, email } = userData;
	return (
		<div className="container">
			<div className="row">
				<div className="col-md-12 m12">
					<div className="logo-header">
						<img src="/assets/storybook.jpg" alt="logo" />
					</div>
					<div className="body">
						<div className="header">
							{displayName && <p>Hello {displayName}</p>}{" "}
							<h4>Welcome to Storybook</h4>
						</div>
						<div className="content">
							<div className="things">
								<p>This is a place to share stories and ideas.</p>
								<h4>Things you can do</h4>
								<p>
									You can create a new story, start by clicking the{" "}
									<b>
										<i className="material-icons">add</i> icon
									</b>{" "}
									or read other users story, by clicking the{" "}
									<b>
										<i className="material-icons">home</i>
									</b>{" "}
									icon.
								</p>
								<p>
									You can also view a user profile, send private message, follow
									the user and engage in activity.
								</p>
								<p>
									You can also comment on other users stories, or reply another
									user comment.
								</p>
							</div>
							<div className="privacy">
								<h3>Privacy Policy</h3>
								<p>
									Storybook is a free service that allows you to share stories
									and ideas.
								</p>
								<p>
									This <b>Privacy Policy</b> explains how Storybook collects,
									uses, and display information about you.
								</p>
							</div>
							<div className="what-we-collect">
								<h4>What we collect</h4>
								<p>
									We collect information about your device, browser, such as
									network connectivity, as to give you best browsing experience.
									We also collect information about your username. But however
									we do not store all this information. We only use this
									information to provide you with the best experience. While you
									are online and using our services, we may also use this
									information to send you information about our services and
									products.
								</p>
							</div>
							<div className="what-we-dont-collect">
								<h4>What we don't collect</h4>
								<p>
									We don't collect any personal information about you, such as
									your password, credit card, or other financial information.{" "}
									<b>
										We do not collect any information about you that could
										identify you, or infurige you or your personal life
									</b>
								</p>
							</div>
						</div>
						<div className="about-us">
							<h4>About Us</h4>
							<p>
								<a
									href="https://www.dprincecoder.com"
									target="_blank"
									rel="noopener noreferrer">
									dprincecoder
								</a>{" "}
								is the creator of this project, and the current CEO of{" "}
								<b>Storybook.</b>
							</p>
							<p>
								<b>Storybook</b> #25 churchil street, PORT HARCOURT, NIGERIA.{" "}
							</p>
							<div className="hire-developer">
								<h5>Hire the developer</h5>
								<p>
									If you are interested in hiring the developer, please contact
									him on{" "}
									<a
										href="https://www.dprincecoder.com"
										target="_blank"
										rel="noopener noreferrer">
										<i>www.dprincecoder.codes</i>
									</a>
								</p>
							</div>
						</div>
						<div className="divider"></div>
						<footer style={{ marginTop: "2rem" }}>
							<p>
								created with <span style={{ color: "red" }}>&#10084;</span> by
								dprincecoder{" "}
							</p>
						</footer>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Welcome;
