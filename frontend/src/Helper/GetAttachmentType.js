export const GetAttachmentType = (attachment) => {
    if (attachment.type.startsWith('image')) return 'image';
    else if (attachment.type.startsWith('video')) return 'video';
    else if (attachment.type.startsWith('audio')) return 'audio';
    else return 'file';
}