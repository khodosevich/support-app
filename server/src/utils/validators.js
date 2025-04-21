const validateUser = (userData) => {
	if (!userData.username || userData.username.length < 3) {
		return 'Username must be at least 3 characters long';
	}
	if (!userData.password || userData.password.length < 6) {
		return 'Password must be at least 6 characters long';
	}
	if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
		return 'Valid email is required';
	}
	return null;
};

module.exports = { validateUser };

// assigneeValidator.js
const validateAssignee = (assigneeData) => {
	if (!assigneeData.name || assigneeData.name.length < 2) {
		return 'Name must be at least 2 characters long';
	}
	if (!assigneeData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assigneeData.email)) {
		return 'Valid email is required';
	}
	if (!assigneeData.password || assigneeData.password.length < 8) {
		return 'Password must be at least 8 characters long';
	}
	if (!assigneeData.specialization) {
		return 'Specialization is required';
	}
	return null;
};

module.exports = { validateAssignee };

// ticketValidator.js
const validateTicket = (ticketData) => {
	if (!ticketData.title || ticketData.title.length < 5) {
		return 'Title must be at least 5 characters long';
	}
	if (!ticketData.description || ticketData.description.length < 10) {
		return 'Description must be at least 10 characters long';
	}
	return null;
};

module.exports = { validateTicket };