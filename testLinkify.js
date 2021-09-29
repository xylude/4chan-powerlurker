const str = '123 https://www.youtube.com/watch?v=a1BQdSLDxGc 123';

const links = str
	.replace(/(<wbr>|<\/wbr>)/g, '')
	.match(/https?:\/\/((w{3}|m)\.)?(youtube\.com|youtu\.be)(.+?)(\s|<|$)/gi);

console.log(links);
