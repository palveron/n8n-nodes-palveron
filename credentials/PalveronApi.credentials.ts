import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class PalveronApi implements ICredentialType {
	name = 'palveronApi';
	displayName = 'PALVERON API';
	documentationUrl = 'https://docs.palveron.com/integrations/n8n';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Your PALVERON project API key (starts with pv_live_)',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://gateway.palveron.com',
			description: 'Gateway URL. Change for on-premise deployments.',
		},
	];
}
