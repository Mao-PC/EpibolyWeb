export default function initRight(props, callback) {
	if (props && props.cRight) {
		let cRight = {};
		props.cRight.forEach((right) => {
			switch (right.key) {
				case '2':
					cRight.query = right.value;
					break;
				case '3':
					cRight.add = right.value;
					break;
				case '4':
					cRight.edit = right.value;
					break;
				case '5':
					cRight.delete = right.value;
					break;
				default:
					break;
			}
		});
		this.setState({ cRight });
	}
}
