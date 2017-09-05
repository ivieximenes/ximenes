// $Revision: 13790 $ $Date: 2011-11-18 14:34:51 -0200 (Fri, 18 Nov 2011) $
function updateMessageProgress(max, value, text, progressId)
{
	var width = 220;
	var widthDone, percent;
	if (value >= max)
		max = 0;
	if (max == 0)
	{
		widthDone = width;
		percent = 100;
	}
	else
	{
		widthDone = value * width / max;
		percent = Math.floor(value * 100 / max);
	}
	var widthRemaining = width - widthDone;

	document.getElementById(progressId + "Done").width = widthDone;
	document.getElementById(progressId + "Remaining").width = widthRemaining;
	document.getElementById(progressId + "Percent").innerText = percent + "%";

	if (text != null)
		document.getElementById(progressId + "Text").innerText = text;
}

function finalizeMessageProgress(text, progressId)
{
	document.getElementById(progressId + "Area").innerText = text;
}

function scrollToBottom()
{
	document.body.scrollTop = document.body.scrollHeight;
}

var lastMessageReceived = false;
function progressEnd()
{
	lastMessageReceived = true;
	if (window.parent != null && window.parent.progressEnd != null)
		window.parent.progressEnd();
}

var lastStart = 0;
function setLastMessageStart(start)
{
	lastStart = start;
}

function pollMessages()
{
	if (!lastMessageReceived)
	{
		$.ajax({
			type: 'POST',
			data: { lumStart:lastStart },
			dataType: 'html',
			success: function(html)
			{
				$(document.body).append(html);
				setTimeout(pollMessages, 5000);
			}
		});
	}
}

$(function() { pollMessages(); });
