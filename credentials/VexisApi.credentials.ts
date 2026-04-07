import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class VexisApi implements ICredentialType {
	name = 'vexisApi';
	displayName = 'VEXIS API';
	documentationUrl = 'https://docs.vexis.io/integrations/n8n';
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
			description: 'Your VEXIS project API key (starts with gp_live_ or gp_test_)',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://gateway.vexis.io',
			description: 'Gateway URL. Change for on-premise deployments.',
		},
	];
}
