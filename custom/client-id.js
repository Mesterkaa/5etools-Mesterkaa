"use strict";

const ClientId = localStorage.getItem("ClientId");
console.log(`Current clientid: ${ClientId}`);


const baseUrl = `${window.location.protocol}//${window.location.host}`;

const usernameClass ="username";

const url = `${baseUrl}/storage/distinctIds`;
$(document).ready(() => {
	if (ClientId == null) {
		$("#currentUsername").text("Username needed to continue");
	} else {
		$("#currentUsername").text(`Current username: '${ClientId}'`);
	}

	fetch(url, {
		method: 'GET'
	})
	.then(async (response) => {
		let json = await response.json();
		json.forEach(username => {
			$("#usernameTable").prepend(`
			<tr ${username == ClientId ? 'class="currentRow"' : ''}>
				<td class="${usernameClass}">${username}</td>
				<td><button class="selectButton" type="button">Select</button></td>
			</tr>`
			)
		});
		$(".selectButton").on("click", function() {
			let textElement = this.parentElement.parentElement.getElementsByClassName(usernameClass)[0];
			let username = '';
			if (textElement.tagName == 'TD') {
				username = textElement.innerText;
			} else if (textElement.tagName == 'INPUT') {
				username = textElement.value.replace(/\s/g, '');
				if (username === '') {
					alert("No username given, try again");
					return;
				} else {
					var confirmed = confirm(`Confirm the use of the username: '${username}'`);
					if (confirmed == false) return;
				}
			}

			localStorage.setItem("ClientId", username);
				window.location = '/';
		})
		console.log(json)
	})
	.catch(error => {
		console.error(error)
	});


})

