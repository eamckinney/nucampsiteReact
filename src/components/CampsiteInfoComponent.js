import React, { Component } from "react";
import {
	Card,
	CardImg,
	CardText,
	CardBody,
	Breadcrumb,
	BreadcrumbItem,
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Label,
	Col,
	Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import { Control, LocalForm, Errors } from "react-redux-form";
import { Loading } from "./LoadingComponent";

// Presentational Component

function RenderCampsite({ campsite }) {
	return (
		<div className="col-md-5 m-1">
			<Card>
				<CardImg top src={campsite.image} alt={campsite.name} />
				<CardBody>
					<CardText>{campsite.description}</CardText>
				</CardBody>
			</Card>
		</div>
	);
}

const maxLength = (len) => (val) => !val || val.length <= len;
const minLength = (len) => (val) => val && val.length >= len;

class CommentForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isModalOpen: false,
		};
	}

	toggleModal = () => {
		this.setState({
			isModalOpen: !this.state.isModalOpen,
		});
	};

	handleSubmit(values) {
		this.toggleModal();
		this.props.addComment(
			this.props.campsiteId,
			values.rating,
			values.author,
			values.text
		);
	}

	render() {
		return (
			<React.Fragment>
				<Button outline onClick={this.toggleModal}>
					<i className="fa fa-pencil fa-lg" /> Submit Comment
				</Button>
				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
					<ModalBody>
						<LocalForm
							initialState={{ rating: 1 }}
							onSubmit={(values) => this.handleSubmit(values)}
						>
							<Row className="form-group">
								<Label htmlFor="rating" md={12}>
									Rating
								</Label>
								<Col md={12}>
									<Control.select
										model=".rating"
										id="rating"
										name="rating"
										placeholder="Rating"
										className="form-control"
									>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
									</Control.select>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="author" md={12}>
									Your Name
								</Label>
								<Col md={12}>
									<Control.text
										model=".author"
										id="author"
										name="author"
										placeholder="Your Name"
										className="form-control"
										validators={{
											minLength: minLength(2),
											maxLength: maxLength(15),
										}}
									/>

									<Errors
										className="text-danger"
										model=".author"
										show="touched"
										component="div"
										messages={{
											minLength: "Must be at least 2 characters. Thank you!",
											maxLength: "Must be 15 characters or less, please!",
										}}
									/>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="text" md={12}>
									Comment
								</Label>
								<Col md={12}>
									<Control.textarea
										model=".text"
										id="text"
										name="text"
										className="form-control"
										rows="6"
									/>
								</Col>
							</Row>
							<Row className="form-group">
								<Col>
									<Button type="submit" color="primary">
										Submit
									</Button>
								</Col>
							</Row>
						</LocalForm>
					</ModalBody>
				</Modal>
			</React.Fragment>
		);
	}
}

function RenderComments({ comments, addComment, campsiteId }) {
	if (comments) {
		return (
			<div className="col-md-5 m-1">
				<h4>Comments</h4>
				<div>
					{comments.map((comment) => (
						<div key={comment.id}>
							<p>
								{comment.text}
								<br />
								--{comment.author},{" "}
								{new Intl.DateTimeFormat("en-US", {
									year: "numeric",
									month: "short",
									day: "2-digit",
								}).format(new Date(Date.parse(comment.date)))}
							</p>
						</div>
					))}
				</div>
				<CommentForm campsiteId={campsiteId} addComment={addComment} />
			</div>
		);
	} else {
		return <div></div>;
	}
}

function CampsiteInfo(props) {
	if (props.isLoading) {
		return (
			<div className="container">
				<div className="row">
					<Loading />
				</div>
			</div>
		);
	}
	if (props.errMess) {
		return (
			<div className="container">
				<div className="row">
					<div className="col">
						<h4>{props.errMess}</h4>
					</div>
				</div>
			</div>
		);
	}
	if (props.campsite) {
		return (
			<div className="container">
				<div className="row">
					<div className="col">
						<Breadcrumb>
							<BreadcrumbItem>
								<Link to="/directory">Directory</Link>
							</BreadcrumbItem>
							<BreadcrumbItem active>{props.campsite.name}</BreadcrumbItem>
						</Breadcrumb>
						<h2>{props.campsite.name}</h2>
						<hr />
					</div>
				</div>
				<div className="row">
					<RenderCampsite campsite={props.campsite} />
					<RenderComments
						comments={props.comments}
						addComment={props.addComment}
						campsiteId={props.campsite.id}
					/>
				</div>
			</div>
		);
	} else {
		return <div />;
	}
}

export default CampsiteInfo;
