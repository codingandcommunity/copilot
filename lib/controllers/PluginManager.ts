import { CompositeDisposable, Panel } from 'atom';
import { CopilotState, Copilot } from '../models/Copilot';
import { CopilotViewProps, CopilotView } from '../components/CopilotView';

export interface PluginState {
    copilotState?: CopilotState;
    copilotViewProps?: CopilotViewProps;
}

/**
 * Takes care of getting the plugin up and running, i.e. loading views
 * registering commands, etc.
 */
export class PluginManager {
    copilotView: CopilotView;
    subscriptions: CompositeDisposable;
    
    constructor() {
        
    }
    
    activate(state: PluginState) {
        state = state || {};
        
        // Initialize model
        Copilot.initialize(state.copilotState);

        // Create sidebar
        this.copilotView = new CopilotView(state.copilotViewProps || {});
        atom.workspace.open( this.copilotView );

        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable();
        
        // Register command that toggles this view
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'copilot:toggleSidebar': () => this.toggleSidebar()
        }));
    }
    
    deactivate() {
        this.subscriptions.dispose();
        this.copilotView.destroy();
    }
    
    serialize() {
        return {
            copilotState: Copilot.getInstance().serialize(),
            copilotViewProps: this.copilotView.serialize()
        };
    }
    
    toggleSidebar() {
        atom.workspace.toggle(this.copilotView); 
    }
}